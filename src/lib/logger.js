const REDACTED = '[redacted]';
const SENSITIVE_KEYS = /password|token|secret|authorization|cookie|jwt|uri|connection|string/i;

function safeString(value, maxLength = 600) {
  if (value === undefined || value === null) return value;
  const text = String(value);
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function sanitize(value, depth = 0) {
  if (depth > 4) return '[max-depth]';
  if (value === undefined || value === null) return value;

  if (value instanceof Error) {
    return serializeError(value);
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitize(item, depth + 1));
  }

  if (typeof value === 'object') {
    const clean = {};
    for (const [key, item] of Object.entries(value)) {
      clean[key] = SENSITIVE_KEYS.test(key) ? REDACTED : sanitize(item, depth + 1);
    }
    return clean;
  }

  return safeString(value);
}

function getMongoTopology(error) {
  const topology = error?.reason || error?.cause;
  const servers = topology?.servers instanceof Map
    ? Array.from(topology.servers.keys())
    : undefined;

  if (!topology && !servers) return undefined;

  return {
    type: topology?.type,
    setName: topology?.setName,
    compatible: topology?.compatible,
    stale: topology?.stale,
    servers,
  };
}

function formatValue(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') {
    if (Array.isArray(value) && value.length === 0) return undefined;
    if (!Array.isArray(value) && Object.keys(value).length === 0) return undefined;
    return JSON.stringify(value);
  }
  return String(value);
}

function formatFields(fields = {}) {
  const sanitized = sanitize(fields);
  const excluded = new Set(['startedAt']);
  const priority = [
    'requestId',
    'method',
    'route',
    'path',
    'status',
    'durationMs',
    'ip',
    'uriType',
    'readyState',
    'host',
    'name',
    'isVercel',
  ];

  const entries = [];

  for (const key of priority) {
    if (Object.prototype.hasOwnProperty.call(sanitized, key)) {
      const value = formatValue(sanitized[key]);
      if (value !== undefined) entries.push(`${key}=${value}`);
      excluded.add(key);
    }
  }

  for (const [key, value] of Object.entries(sanitized)) {
    if (excluded.has(key) || key === 'query' || key === 'userAgent') continue;
    const formatted = formatValue(value);
    if (formatted !== undefined) entries.push(`${key}=${formatted}`);
  }

  if (sanitized.query && Object.keys(sanitized.query).length > 0) {
    entries.push(`query=${JSON.stringify(sanitized.query)}`);
  }

  return entries.join(' | ');
}

function formatMongoDetails(mongo) {
  if (!mongo) return '';

  const lines = [
    '  Mongo topology:',
    `    type: ${mongo.type || 'unknown'}`,
    `    setName: ${mongo.setName || 'unknown'}`,
    `    compatible: ${mongo.compatible ?? 'unknown'}`,
  ];

  if (mongo.servers?.length) {
    lines.push(`    servers: ${mongo.servers.join(', ')}`);
  }

  return `\n${lines.join('\n')}`;
}

function formatError(error) {
  const serialized = serializeError(error);
  const title = `${serialized.name || 'Error'}: ${serialized.message || 'No message'}`;
  const code = serialized.code ? `\n  code: ${serialized.code}` : '';
  const stack = serialized.stack ? `\n  stack: ${serialized.stack}` : '';
  return `${title}${code}${formatMongoDetails(serialized.mongo)}${stack}`;
}

function writeLog(level, event, fields = {}, error) {
  const timestamp = new Date().toISOString();
  const context = formatFields(fields);
  const prefix = `[${level.toUpperCase()}] ${timestamp} ${event}`;
  const message = `${prefix}${context ? ` | ${context}` : ''}${error ? `\n  ${formatError(error)}` : ''}`;

  if (level === 'error') {
    console.error(message);
  } else if (level === 'warn') {
    console.warn(message);
  } else {
    console.log(message);
  }
}

export function serializeError(error) {
  return {
    name: error?.name,
    message: safeString(error?.message),
    code: error?.code,
    stack: process.env.NODE_ENV === 'production' ? undefined : error?.stack,
    mongo: getMongoTopology(error),
  };
}

export function createRequestContext(req, routeName) {
  const requestId =
    req?.headers?.get?.('x-vercel-id') ||
    req?.headers?.get?.('x-request-id') ||
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const url = req?.url ? new URL(req.url) : null;

  return {
    requestId,
    route: routeName || url?.pathname || 'unknown',
    method: req?.method || 'UNKNOWN',
    path: url?.pathname,
    query: url ? Object.fromEntries(url.searchParams.entries()) : undefined,
    ip: req?.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: req?.headers?.get?.('user-agent'),
    startedAt: Date.now(),
  };
}

export function logInfo(event, fields = {}) {
  writeLog('info', event, fields);
}

export function logWarn(event, fields = {}) {
  writeLog('warn', event, fields);
}

export function logError(event, error, fields = {}) {
  writeLog('error', event, fields, error);
}

export function withApiLogging(handler, routeName) {
  return async function loggedHandler(req, context) {
    const requestContext = createRequestContext(req, routeName);
    logInfo('api.request.start', requestContext);

    try {
      const response = await handler(req, context, requestContext);
      const durationMs = Date.now() - requestContext.startedAt;
      const status = response?.status || 200;

      const eventFields = {
        ...requestContext,
        durationMs,
        status,
      };

      if (status >= 500) {
        logWarn('api.request.server_error_response', eventFields);
      } else if (status >= 400) {
        logWarn('api.request.client_error_response', eventFields);
      } else {
        logInfo('api.request.success', eventFields);
      }

      return response;
    } catch (error) {
      logError('api.request.unhandled_error', error, {
        ...requestContext,
        durationMs: Date.now() - requestContext.startedAt,
      });

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Internal Server Error',
          requestId: requestContext.requestId,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  };
}

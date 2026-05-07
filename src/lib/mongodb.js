import mongoose from 'mongoose';
import { logError, logInfo } from '@/lib/logger';

const MONGODB_URI = process.env.MONGODB_URI;
const isVercel = Boolean(process.env.VERCEL);

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (isVercel && /localhost|127\.0\.0\.1|\[::1\]/i.test(MONGODB_URI)) {
  throw new Error('MONGODB_URI points to localhost, which is not reachable from Vercel');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    logInfo('db.connection.reuse', {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    logInfo('db.connection.start', {
      readyState: mongoose.connection.readyState,
      uriType: MONGODB_URI.startsWith('mongodb+srv://') ? 'atlas-srv' : 'standard',
      isVercel,
    });

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logInfo('db.connection.success', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      });
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    logError('db.connection.failure', e, {
      readyState: mongoose.connection.readyState,
      isVercel,
    });
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

export function isDatabaseConnectionError(error) {
  return [
    'MongooseServerSelectionError',
    'MongoServerSelectionError',
    'MongoNetworkError',
    'MongoNetworkTimeoutError',
  ].includes(error?.name);
}

export function databaseUnavailableResponse() {
  return {
    success: false,
    message: 'Database unavailable. Please check MongoDB Atlas Network Access and cluster status.',
    status: 503,
  };
}

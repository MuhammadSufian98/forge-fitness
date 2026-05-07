export function ApiResponse({ success, data, message, status = 200 }) {
  return new Response(
    JSON.stringify({
      success,
      ...(data && { data }),
      ...(message && { message }),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

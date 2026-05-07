import { removeAuthCookie } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';
import { logError, withApiLogging } from '@/lib/logger';

async function handlePOST() {
  try {
    await removeAuthCookie();
    return ApiResponse({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logError('auth.logout.failure', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

export const POST = withApiLogging(handlePOST, '/api/auth/logout');

import { removeAuthCookie } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';

export async function POST() {
  try {
    await removeAuthCookie();
    return ApiResponse({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({
        success: false,
        message: 'Unauthorized',
        status: 401,
      });
    }

    await dbConnect();
    const user = await User.findById(authUser.id);

    if (!user) {
      return ApiResponse({
        success: false,
        message: 'User not found',
        status: 404,
      });
    }

    return ApiResponse({
      success: true,
      data: user,
    });
  } catch (error) {
    logError('auth.me.failure', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

export const GET = withApiLogging(handleGET, '/api/auth/me');

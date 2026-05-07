import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';

export async function GET() {
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
    console.error('Auth Me error:', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

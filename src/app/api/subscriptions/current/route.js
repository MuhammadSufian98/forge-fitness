import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    // Find the latest active or pending subscription for the user
    const currentSubscription = await Subscription.findOne({ 
      userId: authUser.id,
      status: { $in: ['Active', 'Pending', 'Grace Period'] }
    }).sort({ createdAt: -1 }).lean();

    return ApiResponse({ success: true, data: currentSubscription });
  } catch (error) {
    logError('subscriptions.current.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/subscriptions/current');

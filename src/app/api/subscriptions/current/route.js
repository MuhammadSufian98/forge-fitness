import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export async function GET() {
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
    console.error('Current Subscription GET Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

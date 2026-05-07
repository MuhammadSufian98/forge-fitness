import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    // Fetch all pending and active subscription records. 
    // Include user identity data (Initials, Name, Email)
    const subscriptions = await Subscription.find({ 
      status: { $in: ['Pending', 'Active'] } 
    })
    .populate('userId', 'fullName email')
    .sort({ createdAt: -1 })
    .lean();

    const formattedSubscriptions = subscriptions.map(sub => {
      const user = sub.userId;
      const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '';
      return {
        ...sub,
        userId: user?._id,
        userName: user?.fullName,
        userEmail: user?.email,
        userInitials: initials
      };
    });

    return ApiResponse({ success: true, data: formattedSubscriptions });
  } catch (error) {
    console.error('Subscription All GET Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

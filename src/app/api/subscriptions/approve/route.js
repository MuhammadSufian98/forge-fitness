import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { logError, withApiLogging } from '@/lib/logger';

async function handlePATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const { requestId, action } = body;

    if (!requestId || !action) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const subscription = await Subscription.findById(requestId);
    if (!subscription) {
      return ApiResponse({ success: false, message: 'Subscription request not found', status: 404 });
    }

    if (action === 'Approve') {
      // 1. ARCHIVE PHASE: Supersede existing active plan for this user
      await Subscription.updateMany(
        { 
          userId: subscription.userId, 
          status: 'Active',
          _id: { $ne: subscription._id } 
        },
        { 
          $set: { 
            status: 'Superseded',
            expiryDate: new Date() // End now
          } 
        }
      );

      // 2. DEPLOY PHASE: Activate the new plan
      subscription.status = 'Active';
      subscription.startDate = new Date();
      
      const expiryDate = new Date();
      if (subscription.billingCycle === 'Monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }
      subscription.expiryDate = expiryDate;

      // 3. IDENTITY SYNC: Update User model
      const user = await User.findById(subscription.userId);
      if (user) {
        user.subscriptionTier = subscription.tier;
        user.status = 'Active';
        
        // Ensure audit log reference exists
        if (!user.subscriptionRef.includes(subscription._id)) {
            user.subscriptionRef.push(subscription._id);
        }
        await user.save();
      }

      await subscription.save();

      // 4. TRIGGER NOTIFICATION: Athlete Journey
      await Notification.create({
        recipientId: subscription.userId,
        type: 'system',
        title: 'Subscription Active',
        message: `Welcome to Elite: Your ${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} access is now active!`,
        data: {
          subscriptionId: subscription._id,
          tier: subscription.tier,
          status: 'Active'
        }
      });

      return ApiResponse({ success: true, message: 'Subscription approved and deployed successfully' });

    } else if (action === 'Reject') {
      subscription.status = 'Rejected';
      await subscription.save();

      return ApiResponse({ success: true, message: 'Subscription rejected' });
    } else {
      return ApiResponse({ success: false, message: 'Invalid action', status: 400 });
    }

  } catch (error) {
    logError('subscriptions.approve.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const PATCH = withApiLogging(handlePATCH, '/api/subscriptions/approve');

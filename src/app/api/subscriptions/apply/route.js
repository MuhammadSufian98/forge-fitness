import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { logError, withApiLogging } from '@/lib/logger';
import { z } from 'zod';

const subscriptionApplySchema = z.object({
  planId: z.enum(['basic', 'pro', 'elite']),
  paymentMethod: z.string().min(1),
  billingCycle: z.enum(['Monthly', 'Annual']),
});

async function handlePOST(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const body = await req.json();
    const validation = subscriptionApplySchema.safeParse(body);

    if (!validation.success) {
      return ApiResponse({ 
        success: false, 
        message: 'Validation failed: ' + validation.error.issues[0].message,
        status: 400 
      });
    }

    const { planId, paymentMethod, billingCycle } = validation.data;

    const user = await User.findById(authUser.id);
    if (!user) {
      return ApiResponse({ success: false, message: 'User not found', status: 404 });
    }

    // 1. PREVENTION: Guard against concurrent pending requests
    const pendingRequest = await Subscription.findOne({ 
      userId: user._id, 
      status: 'Pending' 
    });
    
    if (pendingRequest) {
      logError('subscriptions.apply.pending_exists', new Error('Pending request already exists'), { userId: user._id });
      return ApiResponse({ 
        success: false, 
        message: 'A protocol upgrade is already awaiting deployment.', 
        status: 400 
      });
    }

    // 2. TIER HIERARCHY: Prevent downgrading via simple apply
    const tierHierarchy = { 'free': 0, 'basic': 1, 'pro': 2, 'elite': 3 };
    const currentTierValue = tierHierarchy[user.subscriptionTier] || 0;
    const requestedTierValue = tierHierarchy[planId];

    if (currentTierValue > requestedTierValue) {
      logError('subscriptions.apply.downgrade_blocked', new Error('Manual downgrade required'), { 
        userId: user._id, 
        currentTier: user.subscriptionTier, 
        requestedTier: planId 
      });
      return ApiResponse({ 
        success: false, 
        message: 'You already have an active higher-tier plan. Downgrades require manual verification.', 
        status: 400 
      });
    }

    // 3. CREATE REQUEST
    const newSubscription = await Subscription.create({
      userId: user._id,
      tier: planId,
      status: 'Pending',
      paymentMethod,
      billingCycle
    });

    // 4. TRIGGER NOTIFICATION: Athlete Journey
    await Notification.create({
      recipientId: user._id,
      type: 'system',
      title: 'Application Received',
      message: `Application Received: Your ${planId.charAt(0).toUpperCase() + planId.slice(1)} request is under review.`,
      data: {
        subscriptionId: newSubscription._id,
        tier: planId,
        status: 'Pending'
      }
    });

    // 5. TRIGGER NOTIFICATION: Admin Global Command Hub
    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
      const adminNotifs = admins.map(admin => ({
        recipientId: admin._id,
        type: 'system',
        title: 'New Subscription Request',
        message: `Inbound Alert: ${user.fullName} is requesting ${planId.toUpperCase()} access.`,
        data: {
          section: 'Plans',
          requestId: newSubscription._id,
          type: 'subscription'
        }
      }));
      await Notification.insertMany(adminNotifs);
    }

    return ApiResponse({ 
      success: true, 
      message: 'Subscription request logged. Pending Admin authorization.',
      data: newSubscription, 
      status: 201 
    });

  } catch (error) {
    logError('subscriptions.apply.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const POST = withApiLogging(handlePOST, '/api/subscriptions/apply');

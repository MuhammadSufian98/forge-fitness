import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const notifications = await Notification.find({ recipientId: authUser.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return ApiResponse({ success: true, data: notifications });
  } catch (error) {
    logError('admin.notifications.get.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

async function handlePATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: authUser.id },
        { isRead: true }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { recipientId: authUser.id, isRead: false },
        { isRead: true }
      );
    }

    return ApiResponse({ success: true, message: 'Notifications updated' });
  } catch (error) {
    logError('admin.notifications.patch.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/admin/notifications');
export const PATCH = withApiLogging(handlePATCH, '/api/admin/notifications');

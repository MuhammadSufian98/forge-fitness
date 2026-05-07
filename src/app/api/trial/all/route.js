import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Trial from '@/models/Trial';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const leads = await Trial.find({}).sort({ createdAt: -1 }).populate('repliedBy', 'fullName').lean();

    return ApiResponse({ success: true, data: leads });
  } catch (error) {
    logError('trial.all.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/trial/all');

import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { logError, withApiLogging } from '@/lib/logger';

async function handleDELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const trainer = await User.findOne({ _id: id, role: 'coach' });
    if (!trainer) {
      return ApiResponse({ success: false, message: 'Trainer not found', status: 404 });
    }

    await User.findByIdAndDelete(id);

    return ApiResponse({ success: true, message: 'Trainer offboarded successfully' });
  } catch (error) {
    logError('trainers.delete.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const DELETE = withApiLogging(handleDELETE, '/api/trainers/[id]');

import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE(req, { params }) {
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
    console.error('Trainer DELETE Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

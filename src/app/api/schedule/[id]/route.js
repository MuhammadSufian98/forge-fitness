import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const updateData = { ...body };
    delete updateData.editHistory; // Don't allow manual edit of history

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return ApiResponse({ success: false, message: 'Schedule not found', status: 404 });
    }

    // Add to edit history
    schedule.editHistory.push({
      adminId: user.id,
      action: 'Updated session details'
    });

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        schedule[key] = updateData[key];
      }
    });

    await schedule.save();

    return ApiResponse({ success: true, data: schedule });
  } catch (error) {
    console.error('Schedule PATCH Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return ApiResponse({ success: false, message: 'Schedule not found', status: 404 });
    }

    return ApiResponse({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Schedule DELETE Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import LeaveApplication from '@/models/LeaveApplication';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== 'coach' && authUser.role !== 'admin')) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const query = authUser.role === 'admin' ? {} : { coachId: authUser.id };
    const applications = await LeaveApplication.find(query)
      .sort({ createdAt: -1 })
      .populate('coachId', 'fullName email');

    return ApiResponse({ success: true, data: applications });
  } catch (error) {
    logError('admin.applications.get.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

async function handlePOST(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'coach') {
      return ApiResponse({ success: false, message: 'Unauthorized: Coach access only', status: 401 });
    }

    const body = await req.json();
    const { startDate, endDate, reason } = body;

    if (!startDate || !endDate || !reason) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const newApplication = await LeaveApplication.create({
      coachId: authUser.id,
      startDate,
      endDate,
      reason,
    });

    return ApiResponse({ success: true, data: newApplication, status: 201 });
  } catch (error) {
    logError('admin.applications.post.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

async function handlePATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const updatedApplication = await LeaveApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    return ApiResponse({ success: true, data: updatedApplication });
  } catch (error) {
    logError('admin.applications.patch.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/admin/applications');
export const POST = withApiLogging(handlePOST, '/api/admin/applications');
export const PATCH = withApiLogging(handlePATCH, '/api/admin/applications');

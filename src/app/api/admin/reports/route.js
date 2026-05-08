import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import DailyReport from '@/models/DailyReport';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== 'coach' && authUser.role !== 'admin')) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const query = authUser.role === 'admin' ? {} : { coachId: authUser.id };
    const reports = await DailyReport.find(query).sort({ date: -1, createdAt: -1 });

    return ApiResponse({ success: true, data: reports });
  } catch (error) {
    logError('admin.reports.get.failure', error);
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
    const { date, time, sessionHighlights, issuesEncountered, agendaForNextSession } = body;

    if (!date || !time || !sessionHighlights || !issuesEncountered || !agendaForNextSession) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const newReport = await DailyReport.create({
      coachId: authUser.id,
      date,
      time,
      sessionHighlights,
      issuesEncountered,
      agendaForNextSession,
    });

    return ApiResponse({ success: true, data: newReport, status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return ApiResponse({ success: false, message: 'A report for today has already been submitted', status: 400 });
    }
    logError('admin.reports.post.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/admin/reports');
export const POST = withApiLogging(handlePOST, '/api/admin/reports');

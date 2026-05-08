import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const session = await ChatSession.findOne({ _id: id, userId: authUser.id });

    if (!session) {
      return ApiResponse({ success: false, message: 'Session not found', status: 404 });
    }

    return ApiResponse({
      success: true,
      data: session,
    });
  } catch (error) {
    logError('ai.session.get.failure', error);
    return ApiResponse({ success: false, message: 'Failed to fetch session', status: 500 });
  }
}

async function handleDELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const session = await ChatSession.findOneAndDelete({ _id: id, userId: authUser.id });

    if (!session) {
      return ApiResponse({ success: false, message: 'Session not found', status: 404 });
    }

    return ApiResponse({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    logError('ai.session.delete.failure', error);
    return ApiResponse({ success: false, message: 'Failed to delete session', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/ai-coach/sessions/[id]');
export const DELETE = withApiLogging(handleDELETE, '/api/ai-coach/sessions/[id]');

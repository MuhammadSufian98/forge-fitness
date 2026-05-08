import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET(req) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const sessions = await ChatSession.find({ userId: authUser.id })
      .select('title lastMessageAt createdAt')
      .sort({ lastMessageAt: -1 });

    return ApiResponse({
      success: true,
      data: sessions,
    });
  } catch (error) {
    logError('ai.sessions.get.failure', error);
    return ApiResponse({ success: false, message: 'Failed to fetch sessions', status: 500 });
  }
}

async function handlePOST(req) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const newSession = await ChatSession.create({
      userId: authUser.id,
      title: 'New Session',
      messages: [],
    });

    return ApiResponse({
      success: true,
      data: newSession,
    });
  } catch (error) {
    logError('ai.sessions.create.failure', error);
    return ApiResponse({ success: false, message: 'Failed to create session', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/ai-coach/sessions');
export const POST = withApiLogging(handlePOST, '/api/ai-coach/sessions');

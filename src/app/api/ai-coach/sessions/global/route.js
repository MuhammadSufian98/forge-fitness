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

    // Find or create the single 'Global' session for this user
    let session = await ChatSession.findOne({ 
      userId: authUser.id,
      title: 'Global Session' 
    });

    if (!session) {
      session = await ChatSession.create({
        userId: authUser.id,
        title: 'Global Session',
        messages: [],
      });
    }

    return ApiResponse({
      success: true,
      data: session,
    });
  } catch (error) {
    logError('ai.session.global.failure', error);
    return ApiResponse({ success: false, message: 'Failed to fetch global session', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/ai-coach/sessions/global');

import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import Groq from 'groq-sdk';
import { logError, withApiLogging } from '@/lib/logger';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/models/ChatSession';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function handlePOST(req) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return ApiResponse({ success: false, message: 'Message is required', status: 400 });
    }

    // Always use the 'Global Session' for simplified single-chat history
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

    // Prepare messages for AI context
    const contextMessages = [
      {
        role: 'system',
        content: 'You are the PeakForm Tactical AI. You provide elite, science-based fitness advice. Rules: 1. Max 3 sentences. 2. Use authoritative, motivational tone. 3. Address the athlete by name if provided. 4. Focus on the specific Goal provided in the context.',
      },
    ];

    // Add history from session (last 10 messages for context)
    const history = session.messages.slice(-10).map(m => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content,
    }));
    contextMessages.push(...history);

    // Add current user message
    contextMessages.push({
      role: 'user',
      content: message,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: contextMessages,
      model: 'llama-3.3-70b-versatile',
      max_tokens: 120, // Non-negotiable
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "System failure: AI did not respond.";

    // Save messages to DB
    session.messages.push({ role: 'user', content: message });
    session.messages.push({ role: 'ai', content: aiResponse });

    await session.save();

    return ApiResponse({
      success: true,
      data: {
        response: aiResponse,
      },
    });
  } catch (error) {
    logError('ai.coach.failure', error);
    return ApiResponse({ success: false, message: 'AI processing failed', status: 500 });
  }
}

export const POST = withApiLogging(handlePOST, '/api/ai-coach');

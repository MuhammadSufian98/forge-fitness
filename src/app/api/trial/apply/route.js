import { ApiResponse } from '@/lib/response';
import connectDB from '@/lib/mongodb';
import Trial from '@/models/Trial';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { logError, withApiLogging } from '@/lib/logger';

const trialSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  goal: z.string().min(1),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

async function handlePOST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const limiter = rateLimit(ip, 1, 3600000); // 1 request per hour

    if (limiter.isLimited) {
      return ApiResponse({ 
        success: false, 
        message: `Rate limit exceeded. Try again in ${Math.ceil(limiter.resetIn / 60000)} minutes.`, 
        status: 429 
      });
    }

    await connectDB();
    const body = await req.json();
    
    // UI might send fullName, map it to name
    if (body.fullName && !body.name) body.name = body.fullName;
    // Normalize legacy payloads that still send phone instead of email.
    if (!body.email && body.phone) body.email = body.phone;

    const validation = trialSchema.safeParse(body);

    if (!validation.success) {
      return ApiResponse({ 
        success: false, 
        message: 'Validation failed', 
        data: validation.error.format(), 
        status: 400 
      });
    }

    const { name, email, goal, coordinates } = validation.data;

    // Check if the email already has an active trial
    const existingTrial = await Trial.findOne({ email, status: 'New' });
    if (existingTrial) {
      return ApiResponse({ success: false, message: 'You already have an active trial application', status: 400 });
    }

    const newTrial = await Trial.create({
      name,
      email: email?.toLowerCase(),
      goal,
      coordinates: coordinates || { lat: 0, lng: 0 },
      status: 'New'
    });

    // TRIGGER NOTIFICATION: Admin Global Command Hub
    const admins = await User.find({ role: 'admin' });
    if (admins.length > 0) {
      const adminNotifs = admins.map(admin => ({
        recipientId: admin._id,
        type: 'system',
        title: 'New Trial Lead',
        message: `Inbound Lead: ${name} is requesting access for ${goal}.`,
        data: {
          section: 'Trial',
          requestId: newTrial._id,
          type: 'trial'
        }
      }));
      await Notification.insertMany(adminNotifs);
    }

    return ApiResponse({ success: true, data: newTrial, status: 201 });
  } catch (error) {
    logError('trial.apply.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const POST = withApiLogging(handlePOST, '/api/trial/apply');

import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';
import { rateLimit } from '@/lib/rate-limit';
import { logError, withApiLogging } from '@/lib/logger';
import { z } from 'zod';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'coach', 'athlete']).optional().default('athlete'),
});

async function handlePOST(req) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const { isLimited } = rateLimit(ip, 5, 60000); // 5 attempts per minute

    if (isLimited) {
      return ApiResponse({
        success: false,
        message: 'Too many requests, please try again later',
        status: 429,
      });
    }

    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse({
        success: false,
        message: validation.error.issues[0].message,
        status: 400,
      });
    }

    const { fullName, email, password, role } = validation.data;

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse({
        success: false,
        message: 'User already exists',
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    return ApiResponse({
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      status: 201,
    });
  } catch (error) {
    logError('auth.signup.failure', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

export const POST = withApiLogging(handlePOST, '/api/auth/signup');

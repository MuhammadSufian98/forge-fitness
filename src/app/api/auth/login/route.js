import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req) {
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

    await dbConnect();
    const body = await req.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse({
        success: false,
        message: validation.error.errors[0].message,
        status: 400,
      });
    }

    const { email, password } = validation.data;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse({
        success: false,
        message: 'Invalid credentials',
        status: 401,
      });
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return ApiResponse({
        success: false,
        message: 'Invalid credentials',
        status: 401,
      });
    }

    // Generate JWT
    const token = signToken({ id: user._id, role: user.role });

    // Set cookie
    await setAuthCookie(token);

    return ApiResponse({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

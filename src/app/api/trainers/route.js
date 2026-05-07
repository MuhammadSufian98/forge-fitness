import { ApiResponse } from '@/lib/response';
import { getAuthUser, hashPassword } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { logError, withApiLogging } from '@/lib/logger';

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    // GET Public Access (Athlete View)
    if (!authUser || authUser.role === 'athlete') {
      const activeCoaches = await User.find({ role: 'coach', status: 'Active' }, {
        fullName: 1,
        role: 1,
        profileImage: 1,
        accreditations: 1,
        rating: 1
      }).lean();

      return ApiResponse({ success: true, data: activeCoaches });
    }

    // GET Admin Access (Dashboard View)
    if (authUser.role === 'admin') {
      const allCoaches = await User.find({ role: 'coach' }).lean();
      return ApiResponse({ success: true, data: allCoaches });
    }

    // Coaches can also see the public view or maybe their own data (handled elsewhere usually)
    const coaches = await User.find({ role: 'coach', status: 'Active' }, {
      fullName: 1,
      role: 1,
      profileImage: 1,
      accreditations: 1,
      rating: 1
    }).lean();

    return ApiResponse({ success: true, data: coaches });

  } catch (error) {
    logError('trainers.get.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

async function handlePOST(req) {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const { name, email, password, accreditation } = body;

    if (!name || !email || !password) {
      return ApiResponse({ success: false, message: 'Missing required fields', status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return ApiResponse({ success: false, message: 'User already exists', status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newCoach = await User.create({
      fullName: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'coach',
      accreditations: accreditation ? [accreditation] : [],
      status: 'Active',
      classesCount: 0,
      rating: 0.0,
      retentionRate: 0.0
    });

    const coachData = newCoach.toObject();
    delete coachData.password;

    return ApiResponse({ success: true, data: coachData, status: 201 });
  } catch (error) {
    logError('trainers.post.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/trainers');
export const POST = withApiLogging(handlePOST, '/api/trainers');

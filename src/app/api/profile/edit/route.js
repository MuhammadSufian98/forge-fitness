import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { ApiResponse } from '@/lib/response';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  coachingPhilosophy: z.string().optional(),
  profileImage: z.string().url('Invalid image URL').or(z.literal('')).optional(),
  fitnessGoals: z.string().optional(),
  accreditations: z.array(z.string()).optional(),
  // Admin specific (only editable by admin, but we'll allow self-edit for some fields if role matches)
  adminNotes: z.string().optional(),
});

// Simple sanitization function to strip HTML tags
const sanitize = (str) => {
  if (!str) return str;
  return str.replace(/<[^>]*>?/gm, '');
};

export async function PATCH(req) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return ApiResponse({
        success: false,
        message: 'Unauthorized',
        status: 401,
      });
    }

    await dbConnect();
    const body = await req.json();

    // Validate input
    const validation = profileUpdateSchema.safeParse(body);
    if (!validation.success) {
      return ApiResponse({
        success: false,
        message: validation.error.errors[0].message,
        status: 400,
      });
    }

    // Sanitize text fields
    const sanitizedData = { ...validation.data };
    if (sanitizedData.bio) sanitizedData.bio = sanitize(sanitizedData.bio);
    if (sanitizedData.coachingPhilosophy) sanitizedData.coachingPhilosophy = sanitize(sanitizedData.coachingPhilosophy);
    if (sanitizedData.adminNotes) sanitizedData.adminNotes = sanitize(sanitizedData.adminNotes);
    if (sanitizedData.fitnessGoals) sanitizedData.fitnessGoals = sanitize(sanitizedData.fitnessGoals);

    // Handle password update
    if (sanitizedData.password) {
      sanitizedData.password = await hashPassword(sanitizedData.password);
    }

    // Filter out undefined fields
    const updateData = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, v]) => v !== undefined)
    );

    const user = await User.findByIdAndUpdate(
      authUser.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('+password');

    if (!user) {
      return ApiResponse({
        success: false,
        message: 'User not found',
        status: 404,
      });
    }

    return ApiResponse({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Profile Edit error:', error);
    return ApiResponse({
      success: false,
      message: 'Internal server error',
      status: 500,
    });
  }
}

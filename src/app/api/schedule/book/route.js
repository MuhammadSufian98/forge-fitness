import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const { scheduleId } = await req.json();

    if (!scheduleId) {
      return ApiResponse({ success: false, message: 'Schedule ID is required', status: 400 });
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return ApiResponse({ success: false, message: 'Protocol session not found', status: 404 });
    }

    // 1. Capacity Check
    if (schedule.enrolledUsers.length >= schedule.capacity) {
      return ApiResponse({ success: false, message: 'Protocol at Maximum Capacity', status: 400 });
    }

    // 2. Duplicate Check and Atomic Push
    // $addToSet ensures uniqueness and atomic operation
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { $addToSet: { enrolledUsers: user.id } },
      { new: true, runValidators: true }
    ).populate('coaches', 'fullName');

    // Check if the user was actually added (if they were already there, $addToSet does nothing but won't error)
    // However, the prompt asks to "Ensure the current userId isn't already in the enrolledUsers array" 
    // before atomic push or as part of it. Using $addToSet handles it atomically.
    
    const wasAlreadyEnrolled = schedule.enrolledUsers.includes(user.id);
    if (wasAlreadyEnrolled) {
        return ApiResponse({ success: false, message: 'You are already enrolled in this protocol', status: 400 });
    }

    const currentOccupancy = updatedSchedule.enrolledUsers.length;

    return ApiResponse({
      success: true,
      message: 'Reservation Successful',
      data: {
          ...updatedSchedule.toObject(),
          currentOccupancy,
          coachNames: updatedSchedule.coaches.map(c => c.fullName)
      }
    });
  } catch (error) {
    console.error('Schedule Booking Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

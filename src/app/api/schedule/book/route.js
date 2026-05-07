import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';
import { logError, withApiLogging } from '@/lib/logger';

async function handlePOST(req) {
  let session;
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const { scheduleId, date } = await req.json();

    if (!scheduleId || !date) {
      return ApiResponse({ success: false, message: 'Schedule ID and Date are required', status: 400 });
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return ApiResponse({ success: false, message: 'Protocol session not found', status: 404 });
    }

    // New Booking restriction: currentTime >= startTime
    // Note: startTime for recursive sessions should be calculated based on the 'date' passed
    let effectiveStartTime = new Date(schedule.startTime);
    const targetDate = new Date(date);
    effectiveStartTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (new Date() >= effectiveStartTime) {
      return ApiResponse({ 
        success: false, 
        message: 'Booking window closed for this session.', 
        status: 403 
      });
    }

    // Use a transaction for atomic capacity check and booking
    session = await mongoose.startSession();
    session.startTransaction();

    // Force a write lock on the schedule document to serialize bookings for this session
    // This ensures that two concurrent transactions don't both see the same count before inserting
    await Schedule.findByIdAndUpdate(scheduleId, { $set: { lastBookingAt: new Date() } }).session(session);

    // 1. Check if already booked
    const existingBooking = await Booking.findOne({ userId: user.id, scheduleId, date }).session(session);
    if (existingBooking) {
        await session.abortTransaction();
        return ApiResponse({ success: false, message: 'You are already enrolled in this session', status: 400 });
    }

    // 2. Capacity Check
    const currentOccupancy = await Booking.countDocuments({ scheduleId, date }).session(session);
    if (currentOccupancy >= schedule.capacity) {
      await session.abortTransaction();
      return ApiResponse({ success: false, message: 'Protocol at Maximum Capacity', status: 400 });
    }

    // 3. Create Booking
    const newBooking = await Booking.create([{
        userId: user.id,
        scheduleId,
        date
    }], { session });

    await session.commitTransaction();
    
    return ApiResponse({
      success: true,
      message: 'Reservation Successful',
      data: {
          ...schedule.toObject(),
          currentOccupancy: currentOccupancy + 1,
          isEnrolled: true,
          coachNames: [] // Will be populated in the main feed
      }
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    logError('schedule.book.failure', error);
    if (error.code === 11000) {
        return ApiResponse({ success: false, message: 'You are already enrolled in this session', status: 400 });
    }
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  } finally {
    if (session) session.endSession();
  }
}

export const POST = withApiLogging(handlePOST, '/api/schedule/book');

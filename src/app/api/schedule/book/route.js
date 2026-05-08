import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Schedule from '@/models/Schedule';
import Booking from '@/models/Booking';
import Notification from '@/models/Notification';
import mongoose from 'mongoose';
import { logError, withApiLogging } from '@/lib/logger';

async function handlePOST(req) {
  let session;
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const fullUser = await User.findById(authUser.id);
    if (!fullUser) {
      return ApiResponse({ success: false, message: 'User not found', status: 404 });
    }

    const { scheduleId, date } = await req.json();

    if (!scheduleId || !date) {
      return ApiResponse({ success: false, message: 'Schedule ID and Date are required', status: 400 });
    }

    const schedule = await Schedule.findById(scheduleId).populate('coaches', 'fullName');

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

    // Use a transaction for atomic capacity check and booking if supported
    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (transactionError) {
      session = null;
    }

    // Helper to conditionally add session to queries
    const withSession = (query) => session ? query.session(session) : query;

    try {
      // Force a write lock on the schedule document to serialize bookings for this session
      // This ensures that two concurrent transactions don't both see the same count before inserting
      await withSession(Schedule.findByIdAndUpdate(scheduleId, { $set: { lastBookingAt: new Date() } }));
    } catch (lockError) {
      // Fallback for standalone MongoDB (code 20 or specific message)
      if (lockError.code === 20 || lockError.message.includes('replica set member')) {
        if (session) await session.endSession();
        session = null;
        console.warn('MongoDB Transactions not supported. Falling back to non-atomic execution.');
        await Schedule.findByIdAndUpdate(scheduleId, { $set: { lastBookingAt: new Date() } });
      } else {
        throw lockError;
      }
    }

    // 1. Check if already booked
    const existingBooking = await withSession(Booking.findOne({ userId: authUser.id, scheduleId, date }));
    if (existingBooking) {
        if (session) await session.abortTransaction();
        return ApiResponse({ success: false, message: 'You are already enrolled in this session', status: 400 });
    }

    // 2. Capacity Check
    const currentOccupancy = await withSession(Booking.countDocuments({ scheduleId, date }));
    if (currentOccupancy >= schedule.capacity) {
      if (session) await session.abortTransaction();
      return ApiResponse({ success: false, message: 'Protocol at Maximum Capacity', status: 400 });
    }

    // 3. Create Booking
    const newBooking = await Booking.create([{
        userId: authUser.id,
        scheduleId,
        date
    }], session ? { session } : {});

    // 4. Create Notifications for Coaches
    if (schedule.coaches && schedule.coaches.length > 0) {
      const notificationPromises = schedule.coaches.map(coach => 
        Notification.create([{
          recipientId: coach._id,
          type: 'booking',
          title: 'New Session Booking',
          message: `${fullUser.fullName} has booked ${schedule.title} for ${date}`,
          data: {
            athleteName: fullUser.fullName,
            goal: fullUser.fitnessGoals || 'General Fitness',
            sessionName: schedule.title,
            timeSlot: `${effectiveStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            date: date
          }
        }], session ? { session } : {})
      );
      await Promise.all(notificationPromises);
    }

    // 5. Create Notification for the Athlete (Athlete Journey)
    await Notification.create([{
      recipientId: authUser.id,
      type: 'booking',
      title: 'Reservation Successful',
      message: `Your reservation for ${schedule.title} on ${date} is confirmed.`,
      data: {
        sessionName: schedule.title,
        timeSlot: `${effectiveStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        date: date,
        room: schedule.room,
        coachNames: schedule.coaches.map(c => c.fullName)
      }
    }], session ? { session } : {});

    if (session) await session.commitTransaction();
    
    return ApiResponse({
      success: true,
      message: 'Reservation Successful',
      data: {
          ...schedule.toObject(),
          currentOccupancy: currentOccupancy + 1,
          isEnrolled: true,
          coachNames: schedule.coaches.map(c => c.fullName)
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

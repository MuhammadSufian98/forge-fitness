import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
import Booking from '@/models/Booking';
import { z } from 'zod';

const scheduleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  room: z.string().min(1),
  coaches: z.array(z.string()).min(1),
  capacity: z.number().int().positive(),
  isDaily: z.boolean().optional(),
});

export async function GET(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');

    let query = {};

    if (dateParam) {
      const startOfDay = new Date(dateParam);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateParam);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch sessions that start on this day OR are daily/recursive
      query = {
        $or: [
          {
            startTime: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          },
          { isDaily: true }
        ]
      };
    }

    let projection = {};
    let populateOptions = [];

    if (user.role === 'athlete') {
      projection = {
        title: 1,
        startTime: 1,
        endTime: 1,
        room: 1,
        description: 1,
        coaches: 1,
        capacity: 1,
        isDaily: 1,
      };
      populateOptions = [{ path: 'coaches', select: 'fullName' }];
    } else if (user.role === 'coach') {
      projection = {
        title: 1,
        startTime: 1,
        endTime: 1,
        room: 1,
        description: 1,
        coaches: 1,
        capacity: 1,
        isDaily: 1,
      };
      populateOptions = [
        { path: 'coaches', select: 'fullName' }
      ];
    } else if (user.role === 'admin') {
      projection = {};
      populateOptions = [
        { path: 'coaches', select: 'fullName email' },
        { path: 'editHistory.adminId', select: 'fullName' }
      ];
    }

    const schedules = await Schedule.find(query, projection).populate(populateOptions).lean();

    // Fetch all bookings for the requested date to calculate real occupancy
    if (dateParam) {
        const dateBookings = await Booking.find({ date: dateParam }).lean();
        const now = new Date();
        const formattedSchedules = schedules.map((schedule) => {
          const sessionBookings = dateBookings.filter(b => b.scheduleId.toString() === schedule._id.toString());
          const currentOccupancy = sessionBookings.length;
          
          let effectiveStartTime = new Date(schedule.startTime);
          let effectiveEndTime = new Date(schedule.endTime);

          if (schedule.isDaily) {
            const targetDate = new Date(dateParam);
            effectiveStartTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
            effectiveEndTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

            const originalStart = new Date(schedule.startTime);
            const originalEnd = new Date(schedule.endTime);
            const dayDiff = Math.floor((originalEnd - originalStart) / (1000 * 60 * 60 * 24));
            if (dayDiff > 0) effectiveEndTime.setDate(effectiveEndTime.getDate() + dayDiff);
          }

          const isEnrolled = sessionBookings.some(b => b.userId.toString() === user.id);

          return {
            ...schedule,
            startTime: effectiveStartTime.toISOString(),
            endTime: effectiveEndTime.toISOString(),
            currentOccupancy,
            isEnrolled,
            currentStatus: now > effectiveEndTime ? 'Expired' : now >= effectiveStartTime ? 'Live' : 'Upcoming',
            coachNames: schedule.coaches.map(c => (typeof c === 'object' ? c.fullName : 'Coach'))
          };
        });

        // Special handling for admin/coach roster
        if ((user.role === 'admin' || user.role === 'coach')) {
            const scheduleIds = formattedSchedules.map(s => s._id);
            const fullBookings = await Booking.find({ 
                scheduleId: { $in: scheduleIds },
                date: dateParam 
            }).populate('userId', 'fullName email').lean();

            formattedSchedules.forEach(s => {
                s.enrolledUsers = fullBookings
                    .filter(b => b.scheduleId.toString() === s._id.toString())
                    .map(b => b.userId);
            });
        }

        return ApiResponse({ success: true, data: formattedSchedules });
    } else {
        // DASHBOARD CASE: Return all instances the user has booked
        const userBookings = await Booking.find({ userId: user.id }).populate({
          path: 'scheduleId',
          populate: { path: 'coaches', select: 'fullName' }
        }).lean();
        const now = new Date();
        
        const formattedSchedules = userBookings.map((booking) => {
          const schedule = booking.scheduleId;
          if (!schedule) return null;

          let effectiveStartTime = new Date(schedule.startTime);
          let effectiveEndTime = new Date(schedule.endTime);
          const targetDate = new Date(booking.date);
          
          effectiveStartTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
          effectiveEndTime.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

          const originalStart = new Date(schedule.startTime);
          const originalEnd = new Date(schedule.endTime);
          const dayDiff = Math.floor((originalEnd - originalStart) / (1000 * 60 * 60 * 24));
          if (dayDiff > 0) effectiveEndTime.setDate(effectiveEndTime.getDate() + dayDiff);

          return {
            ...schedule,
            _id: schedule._id, // Keep original ID for UI keys but it's a specific instance
            bookingId: booking._id,
            startTime: effectiveStartTime.toISOString(),
            endTime: effectiveEndTime.toISOString(),
            isEnrolled: true,
            currentStatus: now > effectiveEndTime ? 'Expired' : now >= effectiveStartTime ? 'Live' : 'Upcoming',
            coachNames: schedule.coaches?.map(c => c.fullName) || []
          };
        }).filter(Boolean);

        return ApiResponse({ success: true, data: formattedSchedules });
    }
  } catch (error) {
    console.error('Schedule GET Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user || user.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const body = await req.json();
    const validation = scheduleSchema.safeParse(body);

    if (!validation.success) {
      return ApiResponse({ 
        success: false, 
        message: 'Validation failed', 
        data: validation.error.format(), 
        status: 400 
      });
    }

    const { title, description, startTime, endTime, room, coaches, capacity, isDaily } = validation.data;

    const newSchedule = await Schedule.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      room,
      coaches,
      capacity,
      isDaily: !!isDaily,
      editHistory: [{
        adminId: user.id,
        action: 'Created session'
      }]
    });

    return ApiResponse({ success: true, data: newSchedule, status: 201 });
  } catch (error) {
    console.error('Schedule POST Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

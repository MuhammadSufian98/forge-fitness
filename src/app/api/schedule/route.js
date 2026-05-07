import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import User from '@/models/User';
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

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
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
        enrolledUsers: 1,
        capacity: 1,
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
        enrolledUsers: 1,
        capacity: 1,
      };
      populateOptions = [
        { path: 'coaches', select: 'fullName' },
        { path: 'enrolledUsers', select: 'fullName email' }
      ];
    } else if (user.role === 'admin') {
      projection = {};
      populateOptions = [
        { path: 'coaches', select: 'fullName email' },
        { path: 'enrolledUsers', select: 'fullName email' },
        { path: 'editHistory.adminId', select: 'fullName' }
      ];
    }

    const schedules = await Schedule.find(query, projection).populate(populateOptions).lean();

    const formattedSchedules = schedules.map((schedule) => {
      const currentOccupancy = schedule.enrolledUsers?.length || 0;
      
      if (user.role === 'athlete') {
        const isEnrolled = schedule.enrolledUsers?.some(u => u.toString() === user.id);
        const { enrolledUsers, ...rest } = schedule;
        return {
          ...rest,
          currentOccupancy,
          isEnrolled,
          coachNames: schedule.coaches.map(c => c.fullName)
        };
      }

      if (user.role === 'coach') {
        return {
          ...schedule,
          currentOccupancy,
          coachNames: schedule.coaches.map(c => c.fullName)
        };
      }

      return {
        ...schedule,
        currentOccupancy
      };
    });

    return ApiResponse({ success: true, data: formattedSchedules });
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

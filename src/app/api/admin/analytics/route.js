import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import Schedule from '@/models/Schedule';
import Booking from '@/models/Booking';
import { logError, withApiLogging } from '@/lib/logger';

const TIER_PRICES = {
  'basic': 29,
  'pro': 59,
  'elite': 129
};

async function handleGET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || (authUser.role !== 'admin' && authUser.role !== 'coach')) {
      return ApiResponse({ success: false, message: 'Unauthorized', status: 401 });
    }

    if (authUser.role === 'coach') {
      // COACH SPECIFIC ANALYTICS
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // 1. Total Athletes Assigned (Users who have booked this coach's sessions)
      const mySchedules = await Schedule.find({ coaches: authUser.id });
      const myScheduleIds = mySchedules.map(s => s._id);
      
      const uniqueAthletes = await Booking.distinct('userId', { scheduleId: { $in: myScheduleIds } });
      const totalAthletesAssigned = uniqueAthletes.length;

      // 2. Monthly Attendance Rate
      const attendanceRate = mySchedules.length > 0 
        ? mySchedules.reduce((acc, s) => acc + (s.hubMetrics?.attendanceRate || 0), 0) / mySchedules.length
        : 85; // Default for demo if no schedules

      // 3. Average Session Rating (From User model for this coach)
      const coachData = await User.findById(authUser.id);
      const averageSessionRating = coachData.rating || 4.8;

      return ApiResponse({
        success: true,
        data: {
          stats: {
            attendanceRate: `${attendanceRate.toFixed(1)}%`,
            averageRating: averageSessionRating.toFixed(1),
            totalAthletes: totalAthletesAssigned,
            growth: "+5% vs last month"
          },
          liveFeed: []
        }
      });
    }

    // 1. SECURITY CHECK (Admin only below)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // 2. CORE KPI: TOTAL USERS
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({ createdAt: { $lt: startOfMonth } });
    const usersThisMonth = totalUsers - lastMonthUsers;
    const growth = lastMonthUsers > 0 
      ? `+${((usersThisMonth / lastMonthUsers) * 100).toFixed(1)}%` 
      : '+100%';

    // 3. CORE KPI: MONTHLY REVENUE (Approved/Active subs this month)
    const activeSubsThisMonth = await Subscription.find({
      status: 'Active',
      startDate: { $gte: startOfMonth }
    });
    const monthlyRevenue = activeSubsThisMonth.reduce((acc, sub) => acc + (TIER_PRICES[sub.tier] || 0), 0);

    const pendingSubsThisMonth = await Subscription.find({
      status: 'Pending',
      createdAt: { $gte: startOfMonth }
    });
    const requestedRevenue = pendingSubsThisMonth.reduce((acc, sub) => acc + (TIER_PRICES[sub.tier] || 0), 0);

    const totalRequests = activeSubsThisMonth.length + pendingSubsThisMonth.length;
    const acceptedRequests = activeSubsThisMonth.length;

    // 4. ELITE CONVERSIONS (Elite subs / Total Active subs)
    const totalActiveSubs = await Subscription.countDocuments({ status: 'Active' });
    const eliteSubs = await Subscription.countDocuments({ status: 'Active', tier: 'elite' });
    const eliteConversionRate = totalActiveSubs > 0 
      ? ((eliteSubs / totalActiveSubs) * 100).toFixed(1) + '%' 
      : '0%';

    // 5. GROWTH DATA (Last 6 Months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthLabel = start.toLocaleString('default', { month: 'short' });

      const count = await User.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      const monthSubs = await Subscription.find({
        status: 'Active',
        startDate: { $gte: start, $lte: end }
      });
      const revenue = monthSubs.reduce((acc, sub) => acc + (TIER_PRICES[sub.tier] || 0), 0);

      chartData.push({
        month: monthLabel,
        count, // User signups
        revenue
      });
    }

    // 6. LIVE FEED (Recent activity: Signups & Subscriptions)
    const recentSubs = await Subscription.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const liveFeed = [
      ...recentSubs.map(s => ({
        type: 'Subscription',
        message: `${s.userId?.fullName || 'Athlete'} ${s.status === 'Active' ? 'activated' : 'requested'} ${s.tier.toUpperCase()} tier`,
        timestamp: s.createdAt,
        status: s.status === 'Active' ? 'good' : s.status === 'Pending' ? 'warn' : 'error'
      })),
      ...recentUsers.map(u => ({
        type: 'Signup',
        message: `New Recruit: ${u.fullName} joined the Forge`,
        timestamp: u.createdAt,
        status: 'good'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    return ApiResponse({
      success: true,
      data: {
        stats: {
          totalUsers,
          monthlyRevenue,
          requestedRevenue,
          totalRequests,
          acceptedRequests,
          conversionRate: eliteConversionRate, // Using for Elite Conversions card
          growth,
          facilityLoad: "68%" // Placeholder
        },
        chartData,
        liveFeed
      }
    });

  } catch (error) {
    logError('admin.analytics.failure', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

export const GET = withApiLogging(handleGET, '/api/admin/analytics');

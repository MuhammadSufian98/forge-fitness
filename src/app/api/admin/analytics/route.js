import { ApiResponse } from '@/lib/response';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import Trial from '@/models/Trial';
import Schedule from '@/models/Schedule';

const TIER_PRICES = {
  'basic': 29,
  'pro': 59,
  'elite': 129
};

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || authUser.role !== 'admin') {
      return ApiResponse({ success: false, message: 'Forbidden: Admin access only', status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. CORE KPIs
    const totalUsers = await User.countDocuments();
    
    // Monthly Revenue
    const activeSubsThisMonth = await Subscription.find({
      status: 'Active',
      startDate: { $gte: startOfMonth }
    });
    const monthlyRevenue = activeSubsThisMonth.reduce((acc, sub) => acc + (TIER_PRICES[sub.tier] || 0), 0);

    // Conversion Rate: % of Trial Leads that became Active Members (by email match)
    const allTrialEmails = await Trial.distinct('email');
    const trialsWhoBecameMembers = await User.countDocuments({
      email: { $in: allTrialEmails },
      role: 'athlete',
      status: 'Active'
    });
    const conversionRate = allTrialEmails.length > 0 
      ? ((trialsWhoBecameMembers / allTrialEmails.length) * 100).toFixed(1)
      : 0;

    // 2. GROWTH VELOCITY (7-Month Rolling)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endD = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      
      const userCount = await User.countDocuments({ createdAt: { $lte: endD } });
      const monthSubs = await Subscription.find({
        status: { $in: ['Active', 'Superseded'] },
        startDate: { $gte: d, $lte: endD }
      });
      const monthRev = monthSubs.reduce((acc, sub) => acc + (TIER_PRICES[sub.tier] || 0), 0);
      
      chartData.push({
        month: monthLabel,
        count: userCount,
        revenue: monthRev
      });
    }

    // 3. LIVE ACTIVITY FEED (10 most recent critical events)
    // We'll simulate this by fetching recent docs from multiple collections
    const recentTrials = (await Trial.find().sort({ createdAt: -1 }).limit(5)).map(t => ({
      type: 'Trial',
      message: `New trial lead: ${t.name}`,
      timestamp: t.createdAt
    }));
    
    const recentSubs = (await Subscription.find({ status: 'Active' }).sort({ startDate: -1 }).limit(5).populate('userId', 'fullName')).map(s => ({
      type: 'Subscription',
      message: `${s.userId?.fullName || 'Athlete'} upgraded to ${s.tier.toUpperCase()}`,
      timestamp: s.startDate
    }));

    const liveFeed = [...recentTrials, ...recentSubs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    // 4. FACILITY LOAD
    const totalActiveMembers = await User.countDocuments({ role: 'athlete', status: 'Active' });
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    const todaysSessions = await Schedule.find({
      startTime: { $gte: startOfToday, $lte: endOfToday }
    });
    
    const uniqueEnrolledUsers = new Set();
    todaysSessions.forEach(session => {
      session.enrolledUsers.forEach(uid => uniqueEnrolledUsers.add(uid.toString()));
    });

    const facilityLoad = totalActiveMembers > 0 
      ? ((uniqueEnrolledUsers.size / totalActiveMembers) * 100).toFixed(1)
      : 0;

    return ApiResponse({
      success: true,
      stats: {
        totalUsers,
        monthlyRevenue,
        conversionRate: `${conversionRate}%`,
        growth: "+12%", // Placeholder for trend calculation
        facilityLoad: `${facilityLoad}%`
      },
      chartData,
      liveFeed
    });

  } catch (error) {
    console.error('Admin Analytics Error:', error);
    return ApiResponse({ success: false, message: 'Internal Server Error', status: 500 });
  }
}

"use client";
import React from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/utils/userAuth";
import TrainersSection from "./TrainersSection";
import ScheduleSection from "./ScheduleSection";
import PlansSection from "./PlansSection";
import TrialLeadsSection from "./TrialSection";
import AccountProfileSection from "./ProfileSection";
import CoachDailyReportsSection from "./CoachDailyReportsSection";
import ApplicationsSection from "./ApplicationsSection";
import useAuthStore from "@/stores/auth/useAuthStore";
import { Loader2, TrendingUp, Activity, Users, Star, ClipboardCheck } from "lucide-react";

export default function AdminDashboardSection({ activeSection }) {
  const { user } = useAuthStore();
  const userRole = user?.role;

  const { data: analyticsData, isLoading: analyticsLoading } = useSWR(
    activeSection === "Dashboard" || activeSection === "Home"
      ? "/api/admin/analytics"
      : null,
    fetcher,
  );

  if (activeSection === "Dashboard" || activeSection === "Home") {
    if (analyticsLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    const stats = analyticsData?.data?.stats || {};
    const chartData = analyticsData?.data?.chartData || [];
    const liveFeed = analyticsData?.data?.liveFeed || [];

    const coachStatCards = [
      {
        label: "ATTENDANCE RATE",
        value: stats.attendanceRate || "0%",
        delta: stats.growth || "Steady Performance",
        icon: "activity",
        lucideIcon: <Activity size={24} />,
        trend: "success",
      },
      {
        label: "AVG SESSION RATING",
        value: stats.averageRating || "0.0",
        delta: "Top 5% of Coaches",
        icon: "star",
        lucideIcon: <Star size={24} />,
        trend: "success",
      },
      {
        label: "ATHLETES ASSIGNED",
        value: stats.totalAthletes?.toString() || "0",
        delta: "Total Reach",
        icon: "groups",
        lucideIcon: <Users size={24} />,
        trend: "up",
      },
      {
        label: "DAILY COMPLIANCE",
        value: "100%",
        delta: "Reports Submitted",
        icon: "assignment_turned_in",
        lucideIcon: <ClipboardCheck size={24} />,
        trend: "success",
      },
    ];

    const overviewStatCards = userRole === 'coach' ? coachStatCards : [
      {
        label: "TOTAL USERS",
        value: stats.totalUsers?.toLocaleString() || "0",
        delta: stats.growth || "+0% MoM",
        icon: "groups",
        trend: "up",
        trendText: "trending_up",
      },
      {
        label: "ELITE CONVERSIONS",
        value: stats.conversionRate || "0%",
        delta: "Elite Tier Penetration",
        icon: "bolt",
        trend: "success",
        trendText: "verified",
      },
      {
        label: "MONTHLY REVENUE",
        value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
        delta: `${stats.acceptedRequests || 0}/${stats.totalRequests || 0} Requests Accepted`,
        icon: "payments",
        trend: "up",
        trendText: "trending_up",
      },
      {
        label: "FACILITY LOAD",
        value: stats.facilityLoad || "68%",
        delta: "Real-time Attendance",
        icon: "precision_manufacturing",
        trend: "warning",
        trendText: "warning",
      },
    ];

    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:py-10 custom-scrollbar pb-28">
        <div className="max-w-[1400px] mx-auto space-y-lg">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {overviewStatCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-lg rounded-[2.5rem] flex flex-col justify-between shadow-sm border border-white/40 bg-white/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-black opacity-50">
                      {card.label}
                    </p>
                    <h2 className="text-3xl font-black text-primary mt-1 tracking-tighter italic">
                      {card.value}
                    </h2>
                  </div>
                  <div className="text-secondary">
                    {card.lucideIcon || <span className="material-symbols-outlined text-2xl">{card.icon}</span>}
                  </div>
                </div>
                <p
                  className={`font-black text-[9px] mt-4 flex items-center gap-1 uppercase tracking-wider ${card.trend === "down" ? "text-error" : "text-secondary"}`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {card.trendText || 'trending_up'}
                  </span>{" "}
                  {card.delta}
                </p>
              </motion.div>
            ))}
          </div>

          {userRole !== 'coach' ? (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-lg h-auto lg:min-h-[500px]">
              {/* ... existing chart logic ... */}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[2.5rem] p-xl bg-white/20 border border-white/40"
              >
                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter mb-4">
                  Welcome back, Coach {user?.fullName.split(' ')[0]}
                </h3>
                <p className="text-on-surface-variant font-medium">
                  Your operational dashboard is active. You have 4 sessions scheduled for today. 
                  Don't forget to submit your daily report after 8:00 PM.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Section logic
  if (activeSection === "Plans" && userRole === "admin")
    return <PlansSection />;
  if (activeSection === "Schedule") return <ScheduleSection />;
  if (activeSection === "Trainers" && userRole === "admin")
    return <TrainersSection />;
  if (activeSection === "Trial" && userRole === "admin")
    return <TrialLeadsSection />;
  if (activeSection === "Daily Reports" && userRole === "coach")
    return <CoachDailyReportsSection />;
  if (activeSection === "Applications") return <ApplicationsSection />;
  if (activeSection === "Profile") return <AccountProfileSection />;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-12 custom-scrollbar pb-28">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2.5rem] p-8 border border-white/40 bg-white/20"
        >
          <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">
            {activeSection}
          </h2>
          <p className="mt-3 text-on-surface-variant font-medium max-w-2xl">
            Module initialized. Awaiting further data injection.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

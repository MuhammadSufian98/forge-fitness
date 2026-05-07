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
import useAuthStore from "@/stores/auth/useAuthStore";
import { Loader2, TrendingUp, Activity, Users } from "lucide-react";

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

    const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000);
    const maxCount = Math.max(...chartData.map((d) => d.count), 50);

    // SVG Path Generator for Area Chart
    const getAreaPath = (dataKey, maxVal) => {
      if (chartData.length < 2) return "";
      const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - (d[dataKey] / maxVal) * 80; // Scale to 80% height for padding
        return `${x},${y}`;
      });
      return `M 0,100 L ${points.join(" L ")} L 100,100 Z`;
    };

    const getLinePath = (dataKey, maxVal) => {
      if (chartData.length < 2) return "";
      const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - (d[dataKey] / maxVal) * 80;
        return `${x},${y}`;
      });
      return `M ${points.join(" L ")}`;
    };

    const overviewStatCards = [
      {
        label: "TOTAL USERS",
        value: stats.totalUsers?.toLocaleString() || "0",
        delta: stats.growth || "+0% MoM",
        icon: "groups",
        trend: "up",
        trendText: "trending_up",
        bars: [4, 6, 8, 10, 7],
      },
      {
        label: "ELITE CONVERSIONS",
        value: stats.conversionRate || "0%",
        delta: "Elite Tier Penetration",
        icon: "bolt",
        trend: "success",
        trendText: "verified",
        bars: [10, 10, 10, 10, 10],
      },
      {
        label: "MONTHLY REVENUE",
        value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
        delta: `${stats.acceptedRequests || 0}/${stats.totalRequests || 0} Requests Accepted`,
        icon: "payments",
        trend: "up",
        trendText: "trending_up",
        bars: [3, 5, 9, 7, 11],
      },
      {
        label: "FACILITY LOAD",
        value: stats.facilityLoad || "68%",
        delta: "Real-time Attendance",
        icon: "precision_manufacturing",
        trend: "warning",
        trendText: "warning",
        bars: [6, 8, 10, 11, 12],
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
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    {card.icon}
                  </span>
                </div>
                <p
                  className={`font-black text-[9px] mt-4 flex items-center gap-1 uppercase tracking-wider ${card.trend === "down" ? "text-error" : "text-secondary"}`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {card.trendText}
                  </span>{" "}
                  {card.delta}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-lg h-auto lg:min-h-[500px]">
            {/* NEW AREA TREND CHART */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-7 glass-panel rounded-[2.5rem] relative overflow-hidden bg-mesh flex flex-col p-xl min-h-[400px] border border-white/40"
            >
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="font-h2 text-h2 text-primary">
                    Growth Velocity
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Athlete acquisition and revenue trajectory
                  </p>
                </div>
                <div className="flex gap-sm">
                  <button className="px-md py-xs rounded-full bg-white/50 border border-white font-label-caps text-label-caps text-primary shadow-sm hover:bg-white transition-colors uppercase">
                    Monthly
                  </button>
                </div>
              </div>

              {/* Growth Velocity Visualization */}
              <div className="flex-1 flex flex-col mt-xl relative">
                <div className="flex-1 flex items-end justify-between gap-4 px-2 pb-10 border-b border-primary/5">
                  {chartData.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center italic text-on-surface-variant/40 text-sm">
                      Insufficient historical data for velocity mapping...
                    </div>
                  ) : (
                    chartData.map((data, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center group relative h-full justify-end"
                      >
                        <div className="relative w-full h-48 flex items-end justify-center gap-1">
                          {/* Revenue Bar */}
                          <div className="flex flex-col items-center flex-1 h-full justify-end relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${Math.max((data.revenue / maxRevenue) * 100, data.revenue > 0 ? 5 : 0)}%`,
                              }}
                              className="w-full max-w-[24px] bg-primary/20 rounded-t-lg relative group/bar"
                            >
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-[#071952] text-white text-[9px] px-2 py-1 rounded-md font-black z-20">
                                ${data.revenue}
                              </div>
                            </motion.div>
                          </div>

                          {/* Count Bar */}
                          <div className="flex flex-col items-center flex-1 h-full justify-end relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{
                                height: `${Math.max((data.count / maxCount) * 100, data.count > 0 ? 5 : 0)}%`,
                              }}
                              className="w-full max-w-[24px] bg-secondary rounded-t-lg relative group/bar"
                            >
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-[#35a29f] text-white text-[9px] px-2 py-1 rounded-md font-black z-20">
                                {data.count} Users
                              </div>
                            </motion.div>
                          </div>
                        </div>
                        <span className="font-label-caps text-[10px] text-on-surface-variant font-black mt-4 uppercase tracking-widest">
                          {data.month}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-6 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/20 rounded-sm" />
                    <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
                      Revenue
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-sm" />
                    <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
                      Acquisition
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* LIVE FEED */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3 glass-panel rounded-[3rem] flex flex-col p-8 overflow-hidden border border-white/40 max-h-[500px] bg-white/20"
            >
              <h3 className="text-sm font-black text-primary uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                <Users size={16} /> Activity Feed
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {liveFeed.length > 0 ? (
                  liveFeed.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/50 rounded-2xl border border-white/60 space-y-1 relative overflow-hidden shadow-sm"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        item.status === 'good' ? 'bg-secondary' : 
                        item.status === 'warn' ? 'bg-amber-500' : 
                        item.status === 'error' ? 'bg-error' : 
                        'bg-primary/10'
                      }`} />
                      <p className={`text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'good' ? 'text-secondary' : 
                        item.status === 'warn' ? 'text-amber-600' : 
                        item.status === 'error' ? 'text-error' : 
                        'text-secondary'
                      }`}>
                        {item.type}
                      </p>
                      <p className="text-xs font-bold text-primary leading-tight">
                        {item.message}
                      </p>
                      <p className="text-[8px] text-primary/40 font-black uppercase">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant italic text-center py-10 opacity-50">
                    Pulse quiet...
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Section logic remains same...
  if (activeSection === "Plans" && userRole === "admin")
    return <PlansSection />;
  if (activeSection === "Schedule") return <ScheduleSection />;
  if (activeSection === "Trainers" && userRole === "admin")
    return <TrainersSection />;
  if (activeSection === "Trial" && userRole === "admin")
    return <TrialLeadsSection />;
  if (activeSection === "Daily Reports" && userRole === "coach")
    return <CoachDailyReportsSection />;
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

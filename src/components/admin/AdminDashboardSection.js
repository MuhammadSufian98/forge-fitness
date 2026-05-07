"use client";

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
import { Loader2 } from "lucide-react";

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

    // Dynamic scaling for chart
    const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000);
    const maxCount = Math.max(...chartData.map(d => d.count), 50);

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
          {/* 4 High Impact Stat Cards */}
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
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      {card.label}
                    </p>
                    <h2 className="font-h1 text-h1 text-primary mt-xs tracking-tight">
                      {card.value}
                    </h2>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    {card.icon}
                  </span>
                </div>
                <div className="mt-lg h-12 flex items-end gap-1">
                  {card.bars.map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${(height / 12) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className={`flex-1 rounded-t-sm ${
                        i === card.bars.length - 1
                          ? "bg-secondary"
                          : i === card.bars.length - 2
                            ? "bg-secondary/60"
                            : "bg-secondary/20"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`font-bold text-xs mt-sm flex items-center gap-1 ${
                    card.trend === "down" ? "text-error" : "text-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {card.trendText}
                  </span>{" "}
                  {card.delta}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Secondary Bento Section (70/30) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-lg h-auto lg:h-[500px]">
            {/* Growth Velocity Chart Area */}
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
                    <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-sm" />
                    <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">Acquisition</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Live Transmission Scroll Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-3 glass-panel rounded-[2.5rem] flex flex-col p-xl overflow-hidden border border-white/40 max-h-[500px] bg-white/20"
            >
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-h3 text-h3 text-primary flex items-center gap-sm uppercase italic tracking-tighter">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  Live Activity
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-md pr-sm custom-scrollbar">
                {liveFeed.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic text-center py-10">
                    Waiting for system events...
                  </p>
                ) : (
                  liveFeed.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex gap-md p-md rounded-2xl bg-white/40 border border-white/60 hover:bg-white/60 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${item.type === "Subscription" ? "bg-secondary-container" : "bg-primary-container"} flex items-center justify-center shrink-0`}
                      >
                        <span
                          className={`material-symbols-outlined ${item.type === "Subscription" ? "text-secondary" : "text-primary"}`}
                        >
                          {item.type === "Subscription"
                            ? "verified"
                            : "person_add"}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-body-md text-body-md font-bold text-primary truncate">
                          {item.type.toUpperCase()}
                        </p>
                        <p className="text-[10px] text-on-surface-variant leading-tight line-clamp-2">
                          {item.message}
                        </p>
                        <p className="text-[9px] text-outline mt-xs uppercase font-black opacity-40">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Other sections...
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
            This section is wired into the admin shell and is ready for future
            content.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

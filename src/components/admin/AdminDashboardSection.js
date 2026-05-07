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
    activeSection === "Dashboard" || activeSection === "Home" ? "/api/admin/analytics" : null,
    fetcher
  );

  if (activeSection === "Dashboard" || activeSection === "Home") {
    if (analyticsLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      );
    }

    const stats = analyticsData?.stats || {};
    const chartData = analyticsData?.chartData || [];
    const liveFeed = analyticsData?.liveFeed || [];

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
        delta: "System Intelligence",
        icon: "bolt",
        trend: "success",
        trendText: "verified",
        bars: [10, 10, 10, 10, 10],
      },
      {
        label: "MONTHLY REVENUE",
        value: `$${(stats.monthlyRevenue || 0).toLocaleString()}`,
        delta: "Total Active Tiers",
        icon: "payments",
        trend: "up",
        trendText: "trending_up",
        bars: [3, 5, 9, 7, 11],
      },
      {
        label: "FACILITY LOAD",
        value: stats.facilityLoad || "0%",
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

              {/* Visualization Placeholder with real month labels */}
              <div className="flex-1 flex items-end gap- gutter mt-xl relative">
                <div className="w-full h-full flex items-end justify-between px-4 pb-8">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative w-full flex items-end justify-center h-48">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.revenue / 15000) * 100}%` }}
                          className="w-8 bg-primary/20 rounded-t-lg absolute left-1/4"
                        />
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.count / 150) * 100}%` }}
                          className="w-8 bg-secondary rounded-t-lg relative z-10"
                        />
                      </div>
                      <span className="font-label-caps text-[10px] text-on-surface-variant font-black">{data.month}</span>
                    </div>
                  ))}
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
                  <p className="text-xs text-on-surface-variant italic text-center py-10">Waiting for system events...</p>
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
                        className={`w-10 h-10 rounded-full ${item.type === 'Subscription' ? 'bg-secondary-container' : 'bg-primary-container'} flex items-center justify-center shrink-0`}
                      >
                        <span
                          className={`material-symbols-outlined ${item.type === 'Subscription' ? 'text-secondary' : 'text-primary'}`}
                        >
                          {item.type === 'Subscription' ? 'verified' : 'person_add'}
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
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Footer Section (Asymmetric Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-xl rounded-[2.5rem] bg-primary text-white flex items-center justify-between overflow-hidden relative shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative z-10">
                <p className="font-label-caps text-label-caps text-primary-fixed-dim/70 tracking-widest uppercase">
                  SYSTEM OPERATIONAL STATUS
                </p>
                <h2 className="font-h1 text-h1 text-secondary-fixed italic tracking-tighter">99.98%</h2>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-secondary-fixed border-t-transparent animate-spin duration-[3000ms] relative z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-xl rounded-[2.5rem] border border-white/40 flex items-center gap-xl overflow-hidden bg-white/20"
            >
               <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-6xl">analytics</span>
               </div>
              <div className="flex-1">
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  FACILITY LOAD ANALYSIS
                </p>
                <div className="w-full bg-surface-container rounded-full h-3 mt-sm relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: stats.facilityLoad || "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-secondary h-full rounded-full"
                  />
                </div>
                <p className="font-body-md text-body-md mt-sm font-bold text-primary uppercase italic tracking-tighter">
                  Real-time Active Enrollment:{" "}
                  <span className="text-secondary">
                    {stats.facilityLoad || "0%"}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Other sections...
  if (activeSection === "Plans" && userRole === "admin") return <PlansSection />;
  if (activeSection === "Schedule") return <ScheduleSection />;
  if (activeSection === "Trainers" && userRole === "admin") return <TrainersSection />;
  if (activeSection === "Trial" && userRole === "admin") return <TrialLeadsSection />;
  if (activeSection === "Daily Reports" && userRole === "coach") return <CoachDailyReportsSection />;
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

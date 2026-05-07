"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "@/utils/userAuth";
import {
  Flame,
  Timer,
  Heart,
  Moon,
  TrendingUp,
  Zap,
  ShieldCheck,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  History,
} from "lucide-react";

export default function HomeSection({ user, isGuest = false }) {
  const { data: scheduleData } = useSWR(`/api/schedule`, fetcher);
  const allSchedules = scheduleData?.data || [];

  const nextSession = useMemo(() => {
    return allSchedules
      .filter((s) => s.currentStatus === "Upcoming" && s.isEnrolled)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
  }, [allSchedules]);

  const recentHistory = useMemo(() => {
    return allSchedules
      .filter((s) => s.currentStatus === "Expired" && s.isEnrolled)
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))
      .slice(0, 3);
  }, [allSchedules]);

  const stats = [
    {
      label: "Energy Burned",
      value: user?.kcal || "0",
      unit: "kcal",
      icon: <Flame size={18} />,
      trend: "Tracking",
    },
    {
      label: "Active Time",
      value: user?.activeMinutes || "0",
      unit: "min",
      icon: <Timer size={18} />,
      trend: "Live",
    },
    {
      label: "Heart Performance",
      value: user?.heartRate || "---",
      unit: "bpm",
      icon: <Heart size={18} />,
      trend: "Ready",
    },
    {
      label: "Rest Quality",
      value: user?.sleepScore || "---",
      unit: "/100",
      icon: <Moon size={18} />,
      trend: "Optimal",
    },
  ];

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-y-auto custom-scrollbar h-full font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-32">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 relative min-h-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-8 lg:p-16"
          >
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover opacity-50"
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                alt="IronCore Fitness"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071952] via-[#071952]/90 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#35a29f] animate-pulse"></span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  IronCore System Active
                </span>
              </div>

              <h1 className="text-white font-black text-4xl lg:text-6xl uppercase tracking-tighter italic leading-none">
                FORGE YOUR,{" "}
                <span className="text-[#35a29f] not-italic">ULTIMATE SELF</span>
              </h1>

              <p className="text-white/70 font-medium text-base lg:text-lg block w-full">
                {isGuest
                  ? "Explore recurring sessions, compare plans, and start a trial when you are ready."
                  : (
                    <>
                      Ready to crush it? Your schedule and{" "}
                      <span className="text-white font-bold italic">IronCore</span>{" "}
                      progress are ready.
                    </>
                  )}
              </p>
            </div>
          </motion.section>

          {/* NEXT SESSION WIDGET */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 bg-white rounded-[2.5rem] border border-[#071952]/5 p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.2em]">
                  Next Protocol
                </h3>
                <Calendar className="text-[#088395]" size={16} />
              </div>

              {nextSession ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#071952]/5 flex flex-col items-center justify-center">
                      <span className="text-[8px] font-black text-[#088395] uppercase">
                        {formatDate(nextSession.startTime).split(" ")[0]}
                      </span>
                      <span className="text-lg font-black text-[#071952]">
                        {formatDate(nextSession.startTime).split(" ")[1]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#071952] uppercase italic leading-tight">
                        {nextSession.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-[#088395]" />
                        <span className="text-[10px] font-bold text-[#071952]/40 uppercase tracking-widest">
                          {formatTime(nextSession.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#f2f3f6] rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="block text-[8px] font-black text-[#071952]/30 uppercase mb-0.5">
                        Location
                      </span>
                      <span className="text-xs font-black text-[#071952] uppercase tracking-tighter">
                        {nextSession.room}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-[#071952]/30 uppercase mb-0.5">
                        Coach
                      </span>
                      <span className="text-xs font-black text-[#088395] uppercase italic">
                        {nextSession.coachNames?.[0]?.split(" ")[0] ||
                          "PeakForm"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-xs font-bold text-[#071952]/40 uppercase">
                    {isGuest ? "Recurring protocols preview" : "No upcoming protocols"}
                  </p>
                  <button className="text-[9px] font-black text-[#088395] uppercase mt-2 underline tracking-widest">
                    {isGuest ? "Open Schedule" : "Book Session"}
                  </button>
                </div>
              )}
            </div>

            {nextSession && (
              <button className="w-full mt-6 py-4 bg-[#071952] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-[#071952]/20 hover:bg-[#088395] transition-all flex items-center justify-center gap-2">
                {isGuest ? "Preview Details" : "Session Details"} <ArrowRight size={12} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Tactical Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 shadow-sm group hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl bg-[#f2f3f6] text-[#088395] group-hover:bg-[#088395] group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <span className="text-[9px] font-black text-[#35a29f] uppercase tracking-widest bg-[#35a29f]/10 px-3 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#071952] tracking-tighter italic">
                  {stat.value}
                </span>
                <span className="text-[10px] font-black text-[#071952]/30 uppercase">
                  {stat.unit}
                </span>
              </div>
              <p className="text-[10px] font-black text-[#071952]/50 uppercase mt-2 tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feature */}
          <motion.div
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="w-full md:w-2/5 aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative group shrink-0">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600"
                alt="Elite Training"
              />
              <div className="absolute inset-0 bg-[#071952]/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#088395]/10 text-[#088395] text-[10px] font-black uppercase tracking-widest">
                {isGuest ? "Preview Protocol" : "Recommended Protocol"}
              </div>
              <h3 className="text-4xl font-black text-[#071952] uppercase italic leading-none tracking-tighter">
                Titan Strength <br /> Hybrid HIIT
              </h3>
              <p className="text-sm text-[#071952]/60 leading-relaxed font-medium">
                {isGuest
                  ? "Preview Forge Fitness before signing in. Plans and recurring classes are available in read-only mode."
                  : "Our signature metabolic conditioning program designed to maximize raw power and aesthetic definition. Optimized for all levels."}
              </p>
              <button className="flex items-center gap-3 bg-[#071952] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#071952]/20 hover:bg-[#088395] transition-all">
                {isGuest ? "Browse Plans" : "Enter Protocol"} <Zap size={14} />
              </button>
            </div>
          </motion.div>

          {/* RECENT ACTIVITY CARD */}
          <div className="bg-[#071952] rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35a29f]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight">
                  Recent <br /> Activity
                </h3>
                <History className="text-[#35a29f]" size={24} />
              </div>

              <div className="space-y-6 flex-1">
                {recentHistory.length > 0 ? (
                  recentHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start border-l-2 border-white/10 pl-4 relative"
                    >
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#35a29f]" />
                      <div>
                        <h4 className="text-[11px] font-black uppercase italic text-white/90">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                            {formatDate(item.endTime)}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[9px] font-bold text-[#35a29f] uppercase tracking-widest italic">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center border-2 border-dashed border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      No recent protocols
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-8">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-[#35a29f]"
                  />
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    System Sync
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#35a29f]">
                    65% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

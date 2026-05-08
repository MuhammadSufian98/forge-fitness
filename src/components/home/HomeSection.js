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
  Zap,
  Calendar,
  Clock,
  ArrowRight,
  MapPin,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

export default function HomeSection({ user, isGuest = false }) {
  const { data: scheduleData } = useSWR(`/api/schedule`, fetcher);
  const allSchedules = scheduleData?.data || [];

  const nextSession = useMemo(() => {
    return allSchedules
      .filter((s) => s.currentStatus === "Upcoming" && s.isEnrolled)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
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

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-y-auto custom-scrollbar h-full font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-10 pb-32">
        {/* 1. HERO GREETING SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(7,25,82,0.15)] bg-[#071952] p-10 lg:p-20"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
              alt="IronCore Fitness"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#071952] via-[#071952]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <Sparkles size={14} className="text-[#35a29f]" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
                {getGreeting()}, Athlete
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-white font-black text-5xl lg:text-8xl uppercase tracking-tighter italic leading-[0.85]">
                {user?.fullName?.split(" ")[0] || "FORGE"}
                <br />
                <span className="text-[#35a29f] not-italic">ELITE</span> STATUS
              </h1>
            </div>

            <p className="text-white/50 font-medium text-lg max-w-3xl leading-relaxed">
              {isGuest
                ? "Your tactical preview is active. Initialize your profile to unlock full biometric synchronization."
                : `Systems are nominal. Your next session is synchronized and waiting for execution.`}
            </p>
          </div>

          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#35a29f]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        </motion.section>

        {/* 2. CORE BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NEXT PROTOCOL (Moved where Activity was) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm flex flex-col justify-between min-h-[400px]"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.3em]">
                    Next Execution
                  </h3>
                  <p className="text-2xl font-black text-[#071952] uppercase italic tracking-tighter">
                    Protocol <span className="text-[#088395]">Sync</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#f2f3f6] flex items-center justify-center text-[#088395]">
                  <Calendar size={24} />
                </div>
              </div>

              {nextSession ? (
                <div className="space-y-6">
                  <div className="p-6 bg-[#f2f3f6] rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-[#088395] uppercase">
                          {formatDate(nextSession.startTime).split(" ")[0]}
                        </span>
                        <span className="text-xl font-black text-[#071952] leading-none">
                          {formatDate(nextSession.startTime).split(" ")[1]}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-lg font-black text-[#071952] uppercase italic truncate">
                          {nextSession.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-[#088395]" />
                          <span className="text-xs font-bold text-[#071952]/40 uppercase tracking-widest">
                            {formatTime(nextSession.startTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-[#071952]/5 rounded-2xl space-y-1">
                      <p className="text-[8px] font-black text-[#071952]/30 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin size={10} /> Location
                      </p>
                      <p className="text-xs font-black text-[#071952] uppercase truncate">
                        {nextSession.room}
                      </p>
                    </div>
                    <div className="p-5 bg-white border border-[#071952]/5 rounded-2xl space-y-1">
                      <p className="text-[8px] font-black text-[#071952]/30 uppercase tracking-widest flex items-center gap-1.5">
                        <UserIcon size={10} /> Command
                      </p>
                      <p className="text-xs font-black text-[#088395] uppercase truncate">
                        {nextSession.coachNames?.[0]?.split(" ")[0] || "Staff"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#071952] flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No Protocols Scheduled
                  </p>
                </div>
              )}
            </div>

            <button className="w-full mt-8 py-5 bg-[#071952] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#088395] transition-all flex items-center justify-center gap-3">
              {nextSession ? "See Details" : "Book Session"}{" "}
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* FEATURE HIGHLIGHT (Recommended Protocol) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="w-full md:w-1/2 aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative group shrink-0">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600"
                alt="Elite Training"
              />
              <div className="absolute inset-0 bg-[#071952]/20 group-hover:bg-transparent transition-colors" />
            </div>

            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#088395]/10 text-[#088395] text-[10px] font-black uppercase tracking-widest">
                Recommended Intel
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#071952] uppercase italic leading-[0.9] tracking-tighter">
                Titan Strength <br />{" "}
                <span className="text-[#088395] not-italic">Hybrid HIIT</span>
              </h3>
              <p className="text-sm text-[#071952]/60 leading-relaxed font-medium">
                Our signature metabolic conditioning program designed to
                maximize raw power and aesthetic definition. Optimized for your
                current biometric tier.
              </p>
              <button className="flex items-center gap-3 bg-[#f2f3f6] text-[#071952] px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#071952] hover:text-white transition-all group">
                Enter Protocol{" "}
                <Zap size={14} className="group-hover:fill-current" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* 3. TACTICAL METRICS (Biometrics) */}
        {/* <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 shadow-sm group hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f2f3f6] text-[#088395] flex items-center justify-center group-hover:bg-[#088395] group-hover:text-white transition-colors">
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
        </section> */}
      </div>
    </div>
  );
}

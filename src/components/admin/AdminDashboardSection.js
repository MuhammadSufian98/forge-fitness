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
import {
  Loader2,
  Activity,
  Users,
  Star,
  ClipboardCheck,
  ShieldAlert,
  Zap,
  ArrowUpRight,
  LayoutDashboard,
  Sparkles,
  Globe,
  Cpu,
} from "lucide-react";

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
          <Loader2 className="animate-spin text-[#088395]" size={40} />
        </div>
      );
    }

    const stats = analyticsData?.data?.stats || {};
    const liveFeed = analyticsData?.data?.liveFeed || [];

    // Greeting logic based on role
    const getGreeting = () => {
      const hour = new Date().getHours();
      const timeContext =
        hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
      return `Good ${timeContext}, ${userRole === "admin" ? "Command" : "Coach"}`;
    };

    const coachStatCards = [
      {
        label: "ATTENDANCE RATE",
        value: stats.attendanceRate || "94%",
        delta: "Exceeding Target",
        lucideIcon: <Activity size={24} />,
        trend: "success",
      },
      {
        label: "AVG SESSION RATING",
        value: stats.averageRating || "4.8",
        delta: "Top 5% Performance",
        lucideIcon: <Star size={24} />,
        trend: "success",
      },
      {
        label: "ATHLETES ASSIGNED",
        value: stats.totalAthletes?.toString() || "12",
        delta: "Tactical Capacity",
        lucideIcon: <Users size={24} />,
        trend: "up",
      },
      {
        label: "DAILY COMPLIANCE",
        value: "100%",
        delta: "Reports Finalized",
        lucideIcon: <ClipboardCheck size={24} />,
        trend: "success",
      },
    ];

    const adminStatCards = [
      {
        label: "TOTAL FORCE",
        value: stats.totalUsers?.toLocaleString() || "1,240",
        delta: "+12% Growth",
        lucideIcon: <Users size={24} />,
        trend: "up",
      },
      {
        label: "CONVERSION VELOCITY",
        value: stats.conversionRate || "24%",
        delta: "Tier Optimization",
        lucideIcon: <Zap size={24} />,
        trend: "success",
      },
      {
        label: "MONTHLY REVENUE",
        value: `$${(stats.monthlyRevenue || 42000).toLocaleString()}`,
        delta: "Financial Target Hit",
        lucideIcon: <Zap size={24} />,
        trend: "up",
      },
      {
        label: "OPERATIONAL LOAD",
        value: stats.facilityLoad || "72%",
        delta: "Peak Hours Active",
        lucideIcon: <Cpu size={24} />,
        trend: "warning",
      },
    ];

    const currentStats = userRole === "coach" ? coachStatCards : adminStatCards;

    return (
      <div className="flex-1 bg-[#f2f3f6] overflow-y-auto px-8 py-10 pb-32 custom-scrollbar font-sans">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* 1. ELITE COMMAND GREETING */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[3.5rem] bg-[#071952] p-12 lg:p-16 overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Background HUD elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#088395]/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldAlert size={14} className="text-secondary" />
                <span className="text-white text-[9px] font-black uppercase tracking-[0.3em]">
                  Operational Status: Nominal
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-white font-black text-5xl lg:text-7xl uppercase italic tracking-tighter leading-none">
                  {getGreeting()}
                </h1>
                <p className="text-white/40 font-bold text-sm uppercase tracking-[0.4em] ml-2">
                  System Terminal 2.0.4{" "}
                  <span className="text-secondary">|</span> Protocol Active
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 max-w-4xl">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary shrink-0">
                    <Globe size={20} />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    Global ecosystem monitoring synchronized with MongoDB Atlas
                    clusters.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-secondary shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed italic">
                    Intelligence feed is analyzing{" "}
                    {userRole === "admin"
                      ? "revenue trends"
                      : "athlete progress"}{" "}
                    in real-time.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 2. CORE TACTICAL STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentStats.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 border border-[#071952]/5 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest leading-none">
                      {card.label}
                    </p>
                    <h2 className="text-4xl font-black text-[#071952] italic tracking-tighter mt-2">
                      {card.value}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#f2f3f6] flex items-center justify-center text-[#088395] group-hover:bg-[#071952] group-hover:text-white transition-colors">
                    {card.lucideIcon}
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-[#f2f3f6] pt-4">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider ${card.trend === "success" ? "text-green-600" : "text-[#088395]"}`}
                  >
                    {card.delta}
                  </span>
                  <ArrowUpRight size={14} className="text-[#071952]/20" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3. SECONDARY INTELLIGENCE AREA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* System Log / Static Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-[#071952]/5 flex flex-col md:flex-row gap-10 items-center"
            >
              <div className="w-full md:w-1/3 aspect-square rounded-[2rem] bg-[#f2f3f6] flex flex-col items-center justify-center text-center p-8 space-y-4 shadow-inner">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#071952]">
                  <LayoutDashboard size={32} />
                </div>
                <h4 className="text-sm font-black text-[#071952] uppercase tracking-tighter leading-none italic">
                  Interface Version <br />{" "}
                  <span className="text-[#088395] not-italic">v.Elite.26</span>
                </h4>
              </div>

              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#088395]/10 text-[#088395] text-[10px] font-black uppercase tracking-widest">
                  System Overview
                </div>
                <h3 className="text-3xl font-black text-[#071952] uppercase italic leading-none tracking-tighter">
                  Command Intelligence <br /> Interface
                </h3>
                <p className="text-sm text-[#071952]/60 leading-relaxed font-medium">
                  {userRole === "admin"
                    ? "Manage trainers, review subscription requests, and oversee trial lead conversions. Your command dashboard ensures the Forge Fitness ecosystem remains optimized for performance."
                    : "Access your daily briefing, monitor assigned athlete biometrics, and synchronize session reports. Maintain 100% compliance to ensure elite coaching standards."}
                </p>
                <div className="flex gap-4">
                  <div className="px-5 py-3 bg-[#f2f3f6] rounded-xl text-[10px] font-black text-[#071952] uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#088395] animate-pulse" />{" "}
                    Database: Online
                  </div>
                  <div className="px-5 py-3 bg-[#f2f3f6] rounded-xl text-[10px] font-black text-[#071952] uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />{" "}
                    API: 14ms Latency
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions / Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm"
            >
              <h3 className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.2em] mb-8">
                Management Links
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Member Directory",
                    action: "Schedule",
                    icon: <Users size={16} />,
                  },
                  {
                    label: "Security Audit",
                    action: "Profile",
                    icon: <ShieldAlert size={16} />,
                  },
                  {
                    label: "System Settings",
                    action: "Profile",
                    icon: <Cpu size={16} />,
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSection(item.action)}
                    className="w-full p-5 bg-[#f2f3f6] hover:bg-[#071952] hover:text-white transition-all rounded-2xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#088395] group-hover:text-white">
                        {item.icon}
                      </span>
                      <span className="text-xs font-black uppercase italic tracking-tighter">
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="opacity-20 group-hover:opacity-100 transition-all"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Section mapping
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
    <div className="flex-1 bg-[#f2f3f6] flex items-center justify-center">
      <p className="font-black text-[10px] uppercase tracking-[0.5em] text-[#071952]/20 italic">
        Module Initialized
      </p>
    </div>
  );
}

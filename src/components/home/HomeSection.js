"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  Heart,
  Moon,
  Play,
  Bookmark,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function HomeSection({ setActiveTab }) {
  const stats = [
    {
      label: "Kcal Burned",
      value: "842",
      unit: "kcal",
      icon: <Flame size={18} />,
      color: "text-[#088395]",
      trend: "+12%",
    },
    {
      label: "Min Active",
      value: "45",
      unit: "min",
      icon: <Timer size={18} />,
      color: "text-[#088395]",
      trend: "+5%",
    },
    {
      label: "Avg Heart Rate",
      value: "142",
      unit: "bpm",
      icon: <Heart size={18} />,
      color: "text-[#35a29f]",
      trend: "Peak",
    },
    {
      label: "Sleep Score",
      value: "88",
      unit: "/100",
      icon: <Moon size={18} />,
      color: "text-[#071952]",
      trend: "Stable",
    },
  ];

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-y-auto custom-scrollbar h-full">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-32">
        {/* NEW WIDE HERO: Fixed Text Width Issues */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center p-8 lg:p-16"
        >
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-50"
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
              alt="IronCore Fitness"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071952] via-[#071952]/90 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#35a29f] animate-pulse"></span>
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  IronCore System Active
                </span>
              </div>

              {/* Removed all restrictive widths here to stop the "tower" text effect */}
              <h1 className="text-white font-black text-4xl lg:text-6xl uppercase tracking-tighter italic leading-none">
                Welcome Back,{" "}
                <span className="text-[#35a29f] not-italic">Sufian</span>
              </h1>

              <p className="text-white/70 font-medium text-base lg:text-lg block w-full">
                Ready to crush it? Your schedule and{" "}
                <span className="text-white font-bold italic">IronCore</span>{" "}
                progress are ready.
              </p>
            </div>

            {/* <div className="flex gap-4 w-full md:w-auto shrink-0">
              <button
                onClick={() => setActiveTab("trial")}
                className="flex-1 md:flex-none px-8 py-4 bg-[#088395] text-white font-black rounded-2xl hover:bg-[#35a29f] transition-all shadow-xl shadow-[#088395]/20 uppercase text-xs tracking-widest"
              >
                AI Session
              </button>
            </div> */}
          </div>
        </motion.section>

        {/* Stats Grid - Balanced Spacing */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-[#071952]/5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#f2f3f6] text-[#088395]">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-[#071952]/30 uppercase">
                  {stat.trend}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#071952] tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-[#071952]/40 uppercase">
                  {stat.unit}
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#071952]/60 uppercase mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* Main Content: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#071952]">
          {/* Featured Card */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-[#071952]/5 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 aspect-square rounded-[2rem] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600"
                alt="HIIT"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex gap-2">
                <span className="bg-[#088395]/10 text-[#088395] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Advanced
                </span>
              </div>
              <h3 className="text-3xl font-black uppercase italic">
                Power Forge HIIT
              </h3>
              <p className="text-sm text-[#071952]/60 leading-relaxed">
                Maximize metabolic rate and strength gain with our signature
                high-intensity hybrid program.
              </p>
              <button className="w-fit bg-[#071952] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#071952]/20">
                Start Now
              </button>
            </div>
          </div>

          {/* Activity Mini Chart */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#071952]/5 shadow-sm">
            <h3 className="text-sm font-black uppercase mb-8 flex justify-between items-center opacity-40">
              Activity Trends <TrendingUp size={16} />
            </h3>
            <div className="h-32 flex items-end justify-between gap-2">
              {[40, 70, 45, 90, 65, 80, 55].map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#f2f3f6] rounded-full relative overflow-hidden h-full"
                >
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ${i === 3 ? "bg-[#088395]" : "bg-[#071952]/10"}`}
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

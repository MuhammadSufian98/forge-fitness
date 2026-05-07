"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  Heart,
  Moon,
  TrendingUp,
  Zap,
  ShieldCheck,
  Trophy,
} from "lucide-react";

export default function HomeSection() {
  const stats = [
    {
      label: "Energy Burned",
      value: "---",
      unit: "kcal",
      icon: <Flame size={18} />,
      trend: "Tracking",
    },
    {
      label: "Active Time",
      value: "---",
      unit: "min",
      icon: <Timer size={18} />,
      trend: "Live",
    },
    {
      label: "Heart Performance",
      value: "---",
      unit: "bpm",
      icon: <Heart size={18} />,
      trend: "Ready",
    },
    {
      label: "Rest Quality",
      value: "---",
      unit: "/100",
      icon: <Moon size={18} />,
      trend: "Optimal",
    },
  ];

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-y-auto custom-scrollbar h-full font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-12 pb-32">
        {/* HERO SECTION: General Greeting */}
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
                FORGE YOUR,{" "}
                <span className="text-[#35a29f] not-italic">ULTIMATE SELF</span>
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
            <div className="w-full md:w-2/5 aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600"
                alt="Elite Training"
              />
              <div className="absolute inset-0 bg-[#071952]/20 group-hover:bg-transparent transition-colors"></div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#088395]/10 text-[#088395] text-[10px] font-black uppercase tracking-widest">
                Recommended Protocol
              </div>
              <h3 className="text-4xl font-black text-[#071952] uppercase italic leading-none tracking-tighter">
                Titan Strength <br /> Hybrid HIIT
              </h3>
              <p className="text-sm text-[#071952]/60 leading-relaxed font-medium">
                Our signature metabolic conditioning program designed to
                maximize raw power and aesthetic definition. Optimized for all
                levels.
              </p>
              <button className="flex items-center gap-3 bg-[#071952] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#071952]/20 hover:bg-[#088395] transition-all">
                Enter Protocol <Zap size={14} />
              </button>
            </div>
          </motion.div>

          {/* Side Insight Card */}
          <div className="bg-[#071952] rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#35a29f]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <Trophy size={32} className="text-[#35a29f] mb-6" />
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                Peak Performance <br /> Dashboard
              </h3>
              <p className="text-white/40 text-xs font-medium leading-relaxed">
                Connect your biometric devices to initialize full tracking and
                unlock AI-driven performance feedback.
              </p>
            </div>

            <div className="relative z-10 pt-10">
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
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Flame,
  User,
  ChevronRight,
  XCircle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function ScheduleSection() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeDate, setActiveDate] = useState(12);

  const weekDays = [
    { day: "MON", date: 12 },
    { day: "TUE", date: 13 },
    { day: "WED", date: 14 },
    { day: "THU", date: 15 },
    { day: "FRI", date: 16 },
    { day: "SAT", date: 17 },
  ];

  const classes = [
    {
      id: "cls-1",
      time: "06:00",
      period: "AM",
      title: "HIIT Burn",
      instructor: "Marcus Thorne",
      duration: "45 Min",
      calories: "500 kcal",
      level: "ADVANCED",
      desc: "High-intensity interval training designed to spike your metabolic rate. Expect explosive movements and minimal rest.",
      specialty: "Fat Loss & Endurance",
      enrolled: 18,
      maxCap: 20,
    },
    {
      id: "cls-2",
      time: "10:30",
      period: "AM",
      title: "Power Lifting",
      instructor: "David Goggins",
      duration: "90 Min",
      calories: "750 kcal",
      level: "PRO",
      desc: "Heavy compound movements focusing on the big three: Squat, Bench, and Deadlift. Master your technique under heavy loads.",
      specialty: "Raw Strength",
      enrolled: 5,
      maxCap: 8,
      highlight: true,
    },
  ];

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-10 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header & Date Selector */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-[#071952] uppercase italic tracking-tighter">
                Your <span className="text-[#088395]">Schedule</span>
              </h2>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#088395] uppercase tracking-widest hover:opacity-70 transition-all">
                Full Calendar <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {weekDays.map((day) => (
                <motion.button
                  key={day.date}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveDate(day.date)}
                  className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center transition-all shadow-sm ${
                    activeDate === day.date
                      ? "bg-[#071952] text-white shadow-[#071952]/20"
                      : "bg-white text-[#071952] border border-[#071952]/5 hover:bg-[#088395]/10"
                  }`}
                >
                  <span
                    className={`text-[10px] font-black mb-2 ${activeDate === day.date ? "text-[#35a29f]" : "text-[#071952]/40"}`}
                  >
                    {day.day}
                  </span>
                  <span className="text-2xl font-black">{day.date}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Timeline List */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.3em]">
              Today's Sessions
            </h3>

            <div className="space-y-6 relative border-l-2 border-[#071952]/5 ml-4 pl-8">
              {classes.map((cls) => (
                <motion.div
                  key={cls.id}
                  layoutId={`cls-card-${cls.id}`}
                  className={`relative bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 shadow-sm group transition-all hover:shadow-xl ${cls.highlight ? "ring-2 ring-[#088395]/20" : ""}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#088395] border-4 border-[#f2f3f6]" />

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex gap-6 items-center">
                      <div className="text-center min-w-[70px]">
                        <span className="block text-2xl font-black text-[#071952] leading-none">
                          {cls.time}
                        </span>
                        <span className="text-[10px] font-bold text-[#071952]/30 uppercase tracking-widest">
                          {cls.period}
                        </span>
                      </div>
                      <div className="h-10 w-[1px] bg-[#071952]/10 hidden lg:block" />
                      <div>
                        <h4 className="text-xl font-black text-[#071952] uppercase italic group-hover:text-[#088395] transition-colors">
                          {cls.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <User size={14} className="text-[#35a29f]" />
                          <span className="text-xs font-bold text-[#071952]/60">
                            {cls.instructor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClass(cls)}
                        className="p-4 bg-[#f2f3f6] text-[#071952] rounded-2xl hover:bg-[#071952] hover:text-white transition-all shadow-sm"
                      >
                        <Info size={20} />
                      </button>
                      <button className="flex-1 lg:flex-none px-8 py-4 bg-[#071952] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#088395] transition-all shadow-lg shadow-[#071952]/20">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Expanded Detail View */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClass(null)}
              className="absolute inset-0 bg-[#071952]/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`cls-card-${selectedClass.id}`}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 lg:p-12 bg-[#071952] text-white">
                <div className="flex justify-between items-start mb-8">
                  <span className="px-4 py-1.5 bg-[#35a29f] text-[9px] font-black uppercase tracking-widest rounded-full">
                    {selectedClass.level} Level
                  </span>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="text-white/20 hover:text-white"
                  >
                    <XCircle size={32} />
                  </button>
                </div>
                <h2 className="text-5xl font-black uppercase italic leading-none mb-4">
                  {selectedClass.title}
                </h2>
                <div className="flex flex-wrap gap-4 opacity-70">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Clock size={16} /> {selectedClass.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Flame size={16} /> {selectedClass.calories}
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-12 space-y-10">
                <section>
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Session Overview
                  </h4>
                  <p className="text-[#071952]/70 leading-relaxed font-medium">
                    {selectedClass.desc}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-3">
                      Instructor
                    </h4>
                    <p className="text-[#071952] font-black uppercase italic">
                      {selectedClass.instructor}
                    </p>
                    <p className="text-xs font-bold text-[#071952]/40 uppercase mt-1">
                      {selectedClass.specialty}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-3">
                      Availability
                    </h4>
                    <p className="text-[#071952] font-black text-2xl tracking-tighter">
                      {selectedClass.enrolled} / {selectedClass.maxCap}
                    </p>
                    <p className="text-xs font-bold text-[#071952]/40 uppercase mt-1">
                      Spots Claimed
                    </p>
                  </div>
                </div>

                <button className="w-full py-5 bg-[#088395] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#071952] transition-all shadow-xl shadow-[#088395]/20 flex items-center justify-center gap-3">
                  <CheckCircle2 size={20} /> Confirm My Spot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

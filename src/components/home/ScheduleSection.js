"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useScheduleStore from "@/stores/home/useScheduleStore";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import {
  Calendar,
  Clock,
  Flame,
  User,
  ChevronRight,
  XCircle,
  Info,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";

export default function ScheduleSection({ isReadOnly = false }) {
  const selectedClass = useScheduleStore((state) => state.selectedClass);
  const activeDate = useScheduleStore((state) => state.activeDate);
  const setActiveDate = useScheduleStore((state) => state.setActiveDate);
  const openClass = useScheduleStore((state) => state.openClass);
  const closeClass = useScheduleStore((state) => state.closeClass);
  const bookClass = useScheduleStore((state) => state.bookClass);

  const [activeTab, setActiveTab] = useState("Upcoming"); // Upcoming, Live, History

  const {
    data: scheduleData,
    isLoading,
    error,
  } = useSWR(`/api/schedule?date=${activeDate}`, fetcher);
  const classes = scheduleData?.data || [];

  const [bookingId, setBookingId] = useState(null);

  // Auto-refresh logic to re-categorize sessions when they transition states
  useEffect(() => {
    const timer = setInterval(() => {
      mutate(`/api/schedule?date=${activeDate}`);
    }, 30000); // Check every 30 seconds
    return () => clearInterval(timer);
  }, [activeDate]);

  const filteredClasses = useMemo(() => {
    if (activeTab === "Upcoming")
      return classes.filter((c) => c.currentStatus === "Upcoming");
    if (activeTab === "Live")
      return classes.filter((c) => c.currentStatus === "Live");
    if (activeTab === "History")
      return classes.filter((c) => c.currentStatus === "Expired");
    return classes;
  }, [classes, activeTab]);

  const handleBook = async (e, scheduleId) => {
    e.stopPropagation();
    if (isReadOnly) return;
    setBookingId(scheduleId);
    const result = await bookClass(scheduleId, activeDate);
    if (result.success) {
      mutate(`/api/schedule?date=${activeDate}`);
      // If the selected class is the one being booked, update it too
      if (selectedClass?._id === scheduleId) {
        openClass(result.data);
      }
    } else {
      alert(`System Error: ${result.message}`);
    }
    setBookingId(null);
  };

  // Generate 7 days starting from today
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = -1; i < 7; i++) {
      // Allow 1 day past for history
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        full: date.toISOString().split("T")[0],
        dayName: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        dayNum: date.getDate(),
      });
    }
    return days;
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const mins = Math.floor(diff / 60000);
    return `${mins} Min`;
  };

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
              <div className="flex bg-white/50 p-1 rounded-2xl border border-[#071952]/5">
                {["Upcoming", "Live", "History"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${
                      activeTab === tab
                        ? "bg-[#071952] text-white shadow-lg"
                        : "text-[#071952]/40 hover:text-[#071952]"
                    }`}
                  >
                    {tab === "Live" ? "Ongoing" : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {weekDays.map((day) => (
                <motion.button
                  key={day.full}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveDate(day.full)}
                  className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center transition-all shadow-sm ${
                    activeDate === day.full
                      ? "bg-[#071952] text-white shadow-[#071952]/20"
                      : "bg-white text-[#071952] border border-[#071952]/5 hover:bg-[#088395]/10"
                  }`}
                >
                  <span
                    className={`text-[10px] font-black mb-2 ${activeDate === day.full ? "text-[#35a29f]" : "text-[#071952]/40"}`}
                  >
                    {day.dayName}
                  </span>
                  <span className="text-2xl font-black">{day.dayNum}</span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Timeline List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.3em]">
                {isReadOnly ? "Recurring Preview" : `${activeTab} Sessions`}
              </h3>
              {activeTab === "Live" && filteredClasses.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest italic">
                    Live Feed Active
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
                <p className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest">
                  Loading Protocols...
                </p>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="bg-white/50 border-2 border-dashed border-[#071952]/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-10">
                <Calendar className="text-[#071952]/10 mb-4" size={48} />
                <h4 className="text-xl font-black text-[#071952] uppercase italic">
                  No {activeTab} Protocols
                </h4>
                <p className="text-sm font-medium text-[#071952]/40 mt-2 max-w-xs">
                  {activeTab === "Upcoming"
                    ? "All set! Check back for new sessions."
                    : activeTab === "Live"
                      ? "Nothing live right now. Prepare for the next wave."
                      : "History clear. Ready to forge new records?"}
                </p>
              </div>
            ) : (
              <div className="space-y-6 relative border-l-2 border-[#071952]/5 ml-4 pl-8">
                {filteredClasses.map((cls) => {
                  const isBooking = bookingId === cls._id;
                  const isReserved = cls.isEnrolled;
                  const isExpired = cls.currentStatus === "Expired";
                  const isLive = cls.currentStatus === "Live";

                  return (
                    <motion.div
                      key={cls._id}
                      layoutId={`cls-card-${cls._id}`}
                      className={`relative bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 shadow-sm group transition-all ${isExpired ? "opacity-60 grayscale-[0.5]" : "hover:shadow-xl"}`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-[#f2f3f6] ${isLive ? "bg-red-500 animate-pulse" : isExpired ? "bg-gray-400" : "bg-[#088395]"}`}
                      />

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                          <div className="text-center min-w-[80px]">
                            <span
                              className={`block text-xl font-black leading-none uppercase ${isExpired ? "text-gray-500" : "text-[#071952]"}`}
                            >
                              {formatTime(cls.startTime).split(" ")[0]}
                            </span>
                            <span className="text-[10px] font-bold text-[#071952]/30 uppercase tracking-widest">
                              {formatTime(cls.startTime).split(" ")[1]}
                            </span>
                          </div>
                          <div className="h-10 w-[1px] bg-[#071952]/10 hidden lg:block" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h4
                                className={`text-xl font-black uppercase italic transition-colors ${isExpired ? "text-gray-500" : "group-hover:text-[#088395] text-[#071952]"}`}
                              >
                                {cls.title}
                              </h4>
                              {isLive && (
                                <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" />{" "}
                                  LIVE
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5">
                                <User
                                  size={14}
                                  className={
                                    isExpired
                                      ? "text-gray-400"
                                      : "text-[#35a29f]"
                                  }
                                />
                                <span
                                  className={`text-xs font-bold ${isExpired ? "text-gray-400" : "text-[#071952]/60"}`}
                                >
                                  {cls.coachNames?.join(", ") || "Staff Coach"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin
                                  size={14}
                                  className={
                                    isExpired
                                      ? "text-gray-400"
                                      : "text-[#088395]"
                                  }
                                />
                                <span className="text-xs font-bold text-[#071952]/40 uppercase tracking-tighter">
                                  {cls.room}
                                </span>
                              </div>
                            </div>
                            {/* Occupancy Bar */}
                            {!isExpired && (
                              <div className="mt-4 w-48 h-1.5 bg-[#f2f3f6] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${(cls.currentOccupancy / cls.capacity) * 100}%`,
                                  }}
                                  className={`h-full rounded-full ${isLive ? "bg-red-500" : "bg-[#088395]"}`}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openClass(cls)}
                            className={`p-4 rounded-2xl transition-all shadow-sm ${isExpired ? "bg-gray-100 text-gray-400" : "bg-[#f2f3f6] text-[#071952] hover:bg-[#071952] hover:text-white"}`}
                          >
                            <Info size={20} />
                          </button>
                          <button
                            disabled={
                              isBooking ||
                              isReserved ||
                              isReadOnly ||
                              cls.currentOccupancy >= cls.capacity ||
                              isExpired ||
                              isLive
                            }
                            onClick={(e) => handleBook(e, cls._id)}
                            className={`flex-1 lg:flex-none px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2
                                ${
                                  isExpired
                                    ? "bg-gray-200 text-gray-500 cursor-default shadow-none"
                                    : isLive
                                      ? "bg-red-50/50 text-red-500 border border-red-200 cursor-default shadow-none"
                                      : isReserved
                                        ? "bg-[#35a29f] text-white shadow-[#35a29f]/20"
                                        : "bg-[#071952] text-white hover:bg-[#088395] shadow-[#071952]/20 disabled:opacity-50"
                                }`}
                          >
                            {isBooking ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Booking...
                              </>
                            ) : isExpired ? (
                              "Session Concluded"
                            ) : isLive ? (
                              "Session In Progress"
                            ) : isReserved ? (
                              <>
                                <CheckCircle2 size={16} />
                                Reserved
                              </>
                            ) : isReadOnly ? (
                              "Read Only"
                            ) : cls.currentOccupancy >= cls.capacity ? (
                              "Full Capacity"
                            ) : (
                              "Book Now"
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
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
              onClick={closeClass}
              className="absolute inset-0 bg-[#071952]/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`cls-card-${selectedClass._id}`}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-10 lg:p-12 bg-[#071952] text-white">
                <div className="flex justify-between items-start mb-8">
                  <span className="px-4 py-1.5 bg-[#35a29f] text-[9px] font-black uppercase tracking-widest rounded-full">
                    Elite Session
                  </span>
                  <button
                    onClick={closeClass}
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
                    <Clock size={16} />{" "}
                    {getDuration(
                      selectedClass.startTime,
                      selectedClass.endTime,
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <MapPin size={16} /> {selectedClass.room}
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-12 space-y-10">
                <section>
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Session Overview
                  </h4>
                  <p className="text-[#071952]/70 leading-relaxed font-medium">
                    {selectedClass.description}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-3">
                      Instructors
                    </h4>
                    <p className="text-[#071952] font-black uppercase italic">
                      {selectedClass.coachNames?.join(", ") ||
                        "FORGE FITNESS Staff"}
                    </p>
                    <p className="text-xs font-bold text-[#071952]/40 uppercase mt-1">
                      Lead Performance Coaches
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-3">
                      Availability
                    </h4>
                    <p className="text-[#071952] font-black text-2xl tracking-tighter">
                      {selectedClass.currentOccupancy} /{" "}
                      {selectedClass.capacity}
                    </p>
                    <p className="text-xs font-bold text-[#071952]/40 uppercase mt-1">
                      Spots Claimed
                    </p>
                  </div>
                </div>

                <button
                  disabled={
                    isReadOnly ||
                    bookingId === selectedClass._id ||
                    selectedClass.isEnrolled ||
                    selectedClass.currentOccupancy >= selectedClass.capacity
                  }
                  onClick={(e) => handleBook(e, selectedClass._id)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3
                    ${
                      selectedClass.isEnrolled
                        ? "bg-[#35a29f] text-white shadow-[#35a29f]/20"
                        : "bg-[#088395] text-white hover:bg-[#071952] shadow-[#088395]/20 disabled:opacity-50"
                    }`}
                >
                  {isReadOnly ? (
                    "Read Only Preview"
                  ) : bookingId === selectedClass._id ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Booking...
                    </>
                  ) : selectedClass.isEnrolled ? (
                    <>
                      <CheckCircle2 size={20} />
                      Confirmed My Spot
                    </>
                  ) : selectedClass.currentOccupancy >=
                    selectedClass.capacity ? (
                    "Max Capacity Reached"
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Confirm My Spot
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

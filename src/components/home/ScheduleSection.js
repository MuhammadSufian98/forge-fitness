"use client";
import React, { useMemo, useState } from "react";
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

export default function ScheduleSection() {
  const selectedClass = useScheduleStore((state) => state.selectedClass);
  const activeDate = useScheduleStore((state) => state.activeDate);
  const setActiveDate = useScheduleStore((state) => state.setActiveDate);
  const openClass = useScheduleStore((state) => state.openClass);
  const closeClass = useScheduleStore((state) => state.closeClass);
  const bookClass = useScheduleStore((state) => state.bookClass);

  const { data: scheduleData, isLoading, error } = useSWR(`/api/schedule?date=${activeDate}`, fetcher);
  const classes = scheduleData?.data || [];

  const [bookingId, setBookingId] = useState(null);

  const handleBook = async (e, scheduleId) => {
    e.stopPropagation();
    setBookingId(scheduleId);
    const result = await bookClass(scheduleId);
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
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        full: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNum: date.getDate(),
      });
    }
    return days;
  }, []);

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
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
              <button className="flex items-center gap-2 text-[10px] font-black text-[#088395] uppercase tracking-widest hover:opacity-70 transition-all">
                Full Calendar <ChevronRight size={14} />
              </button>
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
            <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.3em]">
              {activeDate === new Date().toISOString().split('T')[0] ? "Today's" : "Scheduled"} Sessions
            </h3>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
                <p className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest">Loading Protocols...</p>
              </div>
            ) : classes.length === 0 ? (
              <div className="bg-white/50 border-2 border-dashed border-[#071952]/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center px-10">
                <Calendar className="text-[#071952]/10 mb-4" size={48} />
                <h4 className="text-xl font-black text-[#071952] uppercase italic">No Protocols Scheduled</h4>
                <p className="text-sm font-medium text-[#071952]/40 mt-2 max-w-xs">
                  There are no training sessions scheduled for this date yet. Check back later or select another day.
                </p>
              </div>
            ) : (
              <div className="space-y-6 relative border-l-2 border-[#071952]/5 ml-4 pl-8">
                {classes.map((cls) => {
                  const isBooking = bookingId === cls._id;
                  const isReserved = cls.isEnrolled; // Assuming backend sends this or we calculate it

                  return (
                    <motion.div
                      key={cls._id}
                      layoutId={`cls-card-${cls._id}`}
                      className={`relative bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 shadow-sm group transition-all hover:shadow-xl`}
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#088395] border-4 border-[#f2f3f6]" />

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                          <div className="text-center min-w-[80px]">
                            <span className="block text-xl font-black text-[#071952] leading-none uppercase">
                              {formatTime(cls.startTime).split(' ')[0]}
                            </span>
                            <span className="text-[10px] font-bold text-[#071952]/30 uppercase tracking-widest">
                              {formatTime(cls.startTime).split(' ')[1]}
                            </span>
                          </div>
                          <div className="h-10 w-[1px] bg-[#071952]/10 hidden lg:block" />
                          <div>
                            <h4 className="text-xl font-black text-[#071952] uppercase italic group-hover:text-[#088395] transition-colors">
                              {cls.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1.5">
                                <User size={14} className="text-[#35a29f]" />
                                <span className="text-xs font-bold text-[#071952]/60">
                                  {cls.coachNames?.join(', ') || 'Staff Coach'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-[#088395]" />
                                <span className="text-xs font-bold text-[#071952]/40 uppercase tracking-tighter">
                                  {cls.room}
                                </span>
                              </div>
                            </div>
                            {/* Occupancy Bar */}
                            <div className="mt-4 w-48 h-1.5 bg-[#f2f3f6] rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(cls.currentOccupancy / cls.capacity) * 100}%` }}
                                    className="h-full bg-[#088395] rounded-full"
                                />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openClass(cls)}
                            className="p-4 bg-[#f2f3f6] text-[#071952] rounded-2xl hover:bg-[#071952] hover:text-white transition-all shadow-sm"
                          >
                            <Info size={20} />
                          </button>
                          <button 
                            disabled={isBooking || isReserved || cls.currentOccupancy >= cls.capacity}
                            onClick={(e) => handleBook(e, cls._id)}
                            className={`flex-1 lg:flex-none px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2
                                ${isReserved 
                                    ? "bg-[#35a29f] text-white shadow-[#35a29f]/20" 
                                    : "bg-[#071952] text-white hover:bg-[#088395] shadow-[#071952]/20 disabled:opacity-50"}`}
                          >
                            {isBooking ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Booking...
                                </>
                            ) : isReserved ? (
                                <>
                                    <CheckCircle2 size={16} />
                                    Reserved
                                </>
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
                    <Clock size={16} /> {getDuration(selectedClass.startTime, selectedClass.endTime)}
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
                      {selectedClass.coachNames?.join(', ') || 'PeakForm Staff'}
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
                      {selectedClass.currentOccupancy} / {selectedClass.capacity}
                    </p>
                    <p className="text-xs font-bold text-[#071952]/40 uppercase mt-1">
                      Spots Claimed
                    </p>
                  </div>
                </div>

                <button 
                  disabled={bookingId === selectedClass._id || selectedClass.isEnrolled || selectedClass.currentOccupancy >= selectedClass.capacity}
                  onClick={(e) => handleBook(e, selectedClass._id)}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3
                    ${selectedClass.isEnrolled 
                        ? "bg-[#35a29f] text-white shadow-[#35a29f]/20" 
                        : "bg-[#088395] text-white hover:bg-[#071952] shadow-[#088395]/20 disabled:opacity-50"}`}
                >
                  {bookingId === selectedClass._id ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Booking...
                      </>
                  ) : selectedClass.isEnrolled ? (
                      <>
                        <CheckCircle2 size={20} />
                        Confirmed My Spot
                      </>
                  ) : selectedClass.currentOccupancy >= selectedClass.capacity ? (
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

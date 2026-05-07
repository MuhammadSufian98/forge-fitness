"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  Clock,
  MapPin,
  Trash2,
  XCircle,
  User,
  Info,
  Repeat,
  Radio,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Zap,
  Flame,
  CalendarDays,
  Loader2,
  X,
  Target,
  BadgeCheck
} from "lucide-react";
import useScheduleStore from "@/stores/admin/useScheduleStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import useTrainersStore from "@/stores/admin/useTrainersStore";

export default function ScheduleSection() {
  const {
    schedules,
    dynamicDays,
    selectedClass,
    isCreateSessionOpen,
    activeDate,
    isLoading,
    setSelectedClass,
    setIsCreateSessionOpen,
    setActiveDate,
    initializeDynamicDays,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
  } = useScheduleStore();

  const { trainers, fetchTrainers } = useTrainersStore();
  const { user } = useAuthStore();
  const userRole = user?.role;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    room: "Main Hall",
    coaches: [],
    capacity: 20,
    isDaily: false
  });

  useEffect(() => {
    initializeDynamicDays();
    fetchTrainers();
  }, [initializeDynamicDays, fetchTrainers]);

  useEffect(() => {
    if (activeDate) {
      fetchSchedules(activeDate);
    }
  }, [activeDate, fetchSchedules]);

  const handleCreateSession = async (event) => {
    event.preventDefault();
    
    // Construct datetime objects
    const start = new Date(`${activeDate}T${formData.startTime}`);
    const end = new Date(`${activeDate}T${formData.endTime}`);

    const result = await addSchedule({
      ...formData,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      capacity: parseInt(formData.capacity)
    });

    if (result.success) {
      setIsCreateSessionOpen(false);
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        room: "Main Hall",
        coaches: [],
        capacity: 20,
        isDaily: false
      });
    } else {
      alert(result.message);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm("Permanently delete this protocol?")) {
      await deleteSchedule(id);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:py-10 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                Operations <span className="text-[#088395]">Schedule</span>
              </h1>
              <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
                Global Pipeline Control • System Live
              </p>
            </div>
            {userRole === "admin" && (
              <button
                onClick={() => setIsCreateSessionOpen(true)}
                className="flex items-center gap-3 px-8 py-5 bg-[#071952] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#088395] transition-all shadow-xl group"
              >
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />
                Create New Session
              </button>
            )}
          </section>

          {/* DYNAMIC DATE SELECTOR */}
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {dynamicDays.map((day) => (
              <motion.button
                key={day.fullDate}
                whileHover={{ y: -5 }}
                onClick={() => setActiveDate(day.fullDate)}
                className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center transition-all shadow-sm ${
                  activeDate === day.fullDate
                    ? "bg-[#071952] text-white shadow-lg"
                    : "bg-white text-[#071952] border border-[#071952]/5 hover:bg-[#088395]/10"
                }`}
              >
                <span
                  className={`text-[10px] font-black mb-2 ${activeDate === day.fullDate ? "text-[#35a29f]" : "text-[#071952]/40"}`}
                >
                  {day.day}
                </span>
                <span className="text-2xl font-black">{day.date}</span>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
              </div>
            )}
            
            {/* BOX UI TIMELINE */}
            <div className="lg:col-span-8 space-y-6 relative border-l-2 border-[#071952]/5 ml-4 pl-10">
              <h3 className="text-[10px] font-black text-[#071952]/40 uppercase tracking-[0.4em] mb-8">
                Live Session Pipeline
              </h3>

              {schedules.length === 0 ? (
                 <div className="bg-white/50 border-2 border-dashed border-[#071952]/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center">
                    <CalendarDays className="text-[#071952]/10 mb-4" size={48} />
                    <h4 className="text-xl font-black text-[#071952] uppercase italic">Clear Pipeline</h4>
                 </div>
              ) : (
                schedules.map((item) => (
                  <motion.div
                    key={item._id}
                    layoutId={`card-${item._id}`}
                    onClick={() => setSelectedClass(item)}
                    className={`relative bg-white p-8 rounded-[2.5rem] border border-[#071952]/5 cursor-pointer hover:shadow-2xl transition-all group`}
                  >
                    <div
                      className={`absolute -left-[49px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-[#f2f3f6] bg-[#071952]/20`}
                    />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <div className="text-center min-w-[70px]">
                          <span className="block text-xl font-black text-[#071952] leading-none">
                            {formatTime(item.startTime)}
                          </span>
                        </div>
                        <div className="h-12 w-[1px] bg-[#071952]/10 hidden lg:block" />
                        <div>
                          <h4 className="text-2xl font-black text-[#071952] uppercase italic leading-none">
                            {item.title}
                          </h4>
                          <p className="text-xs font-bold text-[#071952]/40 uppercase mt-2 flex items-center gap-2">
                            <User size={14} className="text-[#35a29f]" />{" "}
                            {item.coachNames?.join(" + ") || "PeakForm Staff"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="w-40 space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#071952]/40">
                            <span>Occupancy</span>
                            <span>
                              {item.currentOccupancy}/{item.capacity}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-[#f2f3f6] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.currentOccupancy / item.capacity) * 100}%` }}
                              className="h-full bg-[#088395] rounded-full"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <button 
                            onClick={(e) => handleDelete(e, item._id)}
                            className="p-3 text-red-500/20 hover:text-red-500 transition-colors"
                           >
                              <Trash2 size={18} />
                           </button>
                           <ChevronRight
                            size={20}
                            className="text-[#071952]/20 group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* SIDEBAR: ACTIVE STAFF */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.4em]">
                Active Staff Roster
              </h3>
              <div className="bg-[#071952] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#088395]/20 rounded-full blur-3xl -mr-24 -mt-24" />
                <div className="relative z-10 space-y-6">
                  {trainers.filter(t => t.status === 'Active').slice(0, 5).map((staff, i) => (
                    <div
                      key={staff._id}
                      className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-black uppercase italic leading-none">
                          {staff.fullName}
                        </p>
                        <p className="text-[9px] font-bold text-white/40 uppercase mt-1 tracking-widest">
                          {staff.accreditations?.[0] || 'Performance Coach'}
                        </p>
                      </div>
                      <span className="text-[8px] font-black px-2 py-1 rounded tracking-widest bg-[#35a29f] text-white">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white text-white hover:text-[#071952] rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
                  Manage Roster
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROSTER POPUP (Admin Intelligence) */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClass(null)}
              className="absolute inset-0 bg-[#071952]/90 backdrop-blur-md"
            />
            <motion.aside
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 lg:p-12 bg-[#071952] text-white shrink-0">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#35a29f]/20 rounded-xl flex items-center justify-center">
                      <Target size={20} className="text-[#35a29f]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Protocol Roster Intelligence</span>
                  </div>
                  <button onClick={() => setSelectedClass(null)} className="text-white/20 hover:text-white transition-colors">
                    <X size={28} />
                  </button>
                </div>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">{selectedClass.title}</h2>
                <p className="text-[#088395] font-black text-xs uppercase tracking-[0.3em]">{formatTime(selectedClass.startTime)} — {formatTime(selectedClass.endTime)}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black text-[#071952] uppercase tracking-[0.3em] flex items-center gap-3">
                    <ShieldCheck size={18} className="text-[#088395]" /> Verified Athlete Enrollment
                  </h3>
                  <span className="bg-[#f2f3f6] px-4 py-1.5 rounded-full text-[10px] font-black text-[#071952]">
                    {selectedClass.enrolledUsers?.length || 0} / {selectedClass.capacity} SPOTS
                  </span>
                </div>

                <div className="space-y-4">
                  {!selectedClass.enrolledUsers || selectedClass.enrolledUsers.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-[#f2f3f6] rounded-[2rem] border-2 border-dashed border-[#071952]/5">
                      <Users className="text-[#071952]/10 mb-4" size={48} />
                      <p className="text-sm font-black text-[#071952]/20 uppercase italic tracking-widest">No athletes enrolled yet</p>
                    </div>
                  ) : (
                    selectedClass.enrolledUsers.map((athlete, idx) => (
                      <motion.div
                        key={athlete._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between p-5 bg-[#f2f3f6] rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-[#071952]/5 transition-all border border-transparent hover:border-[#071952]/5 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#071952] text-white rounded-xl flex items-center justify-center font-black italic text-xs shadow-lg">
                            {athlete.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#071952] uppercase italic leading-none">{athlete.fullName}</p>
                            <p className="text-[9px] font-bold text-[#071952]/30 uppercase mt-1 tracking-widest">{athlete.email}</p>
                          </div>
                        </div>
                        <BadgeCheck size={20} className="text-[#088395] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-[#f2f3f6] shrink-0">
                <button className="w-full py-5 bg-[#071952] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#088395] transition-all shadow-xl shadow-[#071952]/20">
                  Export Verified Roster
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Popup: Create Session */}
      <AnimatePresence>
        {isCreateSessionOpen && userRole === "admin" && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 lg:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateSessionOpen(false)}
              className="absolute inset-0 bg-[#071952]/95 backdrop-blur-xl"
            />
            <motion.aside
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-5xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[620px] max-h-[90vh]"
            >
              <div className="w-full md:w-1/3 bg-[#071952] p-10 text-white flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-[#35a29f]/20 rounded-2xl flex items-center justify-center mb-8">
                    <Zap size={32} className="text-[#35a29f] animate-pulse" />
                  </div>
                  <h2 className="text-4xl font-black uppercase italic leading-[0.9] tracking-tighter">
                    Deploy <br />
                    <span className="text-[#088395] not-italic">Protocol</span>
                  </h2>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-6">
                    Operational Intelligence
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[#35a29f]">
                    <ShieldCheck size={16} /> System Validated
                  </div>
                </div>
              </div>

              <div className="flex-1 p-12 overflow-y-auto no-scrollbar relative flex flex-col">
                <button
                  onClick={() => setIsCreateSessionOpen(false)}
                  className="absolute top-8 right-8 text-[#071952]/20 hover:text-[#071952] transition-colors"
                >
                  <XCircle size={32} />
                </button>

                <header className="mb-10">
                  <h3 className="text-sm font-black text-[#071952] uppercase tracking-[0.3em]">
                    Configuration Terminal
                  </h3>
                  <div className="h-1 w-12 bg-[#088395] mt-2 rounded-full" />
                </header>

                <form onSubmit={handleCreateSession} className="space-y-8 flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                        Protocol Name
                      </label>
                      <input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. TITAN STRENGTH"
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                        Room Assignment
                      </label>
                      <input
                        required
                        value={formData.room}
                        onChange={(e) => setFormData({...formData, room: e.target.value})}
                        placeholder="Main Hall"
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                        Start Time
                      </label>
                      <input
                        required
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-xs font-bold text-[#071952]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                        End Time
                      </label>
                      <input
                        required
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-xs font-bold text-[#071952]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                        Capacity
                      </label>
                      <input
                        required
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        placeholder="25"
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-xs font-bold text-[#071952]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                      Instructor Assignment
                    </label>
                    <select 
                        multiple
                        value={formData.coaches}
                        onChange={(e) => {
                           const values = Array.from(e.target.selectedOptions, option => option.value);
                           setFormData({...formData, coaches: values});
                        }}
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-sm font-bold text-[#071952] min-h-[100px]"
                    >
                        {trainers.map(t => (
                           <option key={t._id} value={t._id}>{t.fullName}</option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-2">
                      Operational Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the performance goals for this session..."
                      className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-sm font-bold text-[#071952] min-h-[100px] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-[#f2f3f6] rounded-2xl border border-[#071952]/5">
                    <div className="flex items-center gap-3">
                      <Repeat size={18} className="text-[#088395]" />
                      <div>
                        <p className="text-[10px] font-black text-[#071952] uppercase">
                          Recurrence Routine
                        </p>
                        <p className="text-[8px] font-bold text-[#071952]/40 uppercase tracking-widest">
                          Deploy every 24h
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.isDaily}
                      onChange={(e) => setFormData({...formData, isDaily: e.target.checked})}
                      className="w-6 h-6 accent-[#088395] cursor-pointer"
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-6 bg-[#071952] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#088395] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Deployment"} 
                    {!isLoading && <CheckCircle2 size={20} />}
                  </button>
                </form>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

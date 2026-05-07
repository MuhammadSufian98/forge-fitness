"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
  AlertCircle,
} from "lucide-react";
import useCoachDailyReportsStore from "@/stores/admin/useCoachDailyReportsStore";

export default function CoachDailyReportsSection() {
  const { reports, selectedReport, setSelectedReport } =
    useCoachDailyReportsStore();

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                Daily <span className="text-[#088395]">Reports</span>
              </h1>
              <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                Performance Metrics & Session Analytics
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[#071952]/5 shadow-sm">
              <Calendar size={18} className="text-[#088395]" />
              <span className="text-sm font-black text-[#071952]">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* REPORTS TIMELINE */}
          <div className="space-y-6">
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedReport(report)}
                className="bg-white rounded-[2.5rem] p-8 border border-[#071952]/5 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-sm font-black text-[#071952]/30 uppercase tracking-widest">
                        {new Date(report.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-3xl font-black text-[#071952] mt-1">
                        {new Date(report.date).getDate()}
                      </p>
                    </div>
                    <div className="h-16 w-[1px] bg-[#071952]/10 hidden md:block" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Activity className="text-[#088395]" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest">
                            Sessions Conducted
                          </p>
                          <p className="text-2xl font-black text-[#071952]">
                            {report.totalSessions}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-[#088395]" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest">
                            Total Athletes
                          </p>
                          <p className="text-2xl font-black text-[#071952]">
                            {report.totalAthletes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:text-right space-y-4">
                    <div className="p-4 bg-[#f2f3f6] rounded-2xl border border-[#071952]/5">
                      <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                        Avg Attendance
                      </p>
                      <p className="text-3xl font-black text-[#35a29f]">
                        {report.averageAttendance}
                      </p>
                    </div>

                    {report.highlights.length > 0 && (
                      <div className="space-y-1">
                        {report.highlights.slice(0, 2).map((highlight, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-[9px] font-black text-[#088395] uppercase tracking-widest"
                          >
                            <CheckCircle2 size={12} />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 bg-[#071952] text-white shrink-0">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-[#35a29f] rounded-full text-[8px] font-black uppercase tracking-widest">
                      Daily Report
                    </span>
                    <h2 className="text-3xl font-black uppercase italic mt-3 tracking-tighter">
                      {selectedReport.date}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-white/20 hover:text-white transition-colors text-2xl"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-10 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                {/* KEY METRICS */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#f2f3f6] rounded-2xl p-6 text-center border border-[#071952]/5">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                      Sessions
                    </p>
                    <p className="text-4xl font-black text-[#071952]">
                      {selectedReport.totalSessions}
                    </p>
                  </div>
                  <div className="bg-[#f2f3f6] rounded-2xl p-6 text-center border border-[#071952]/5">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                      Athletes
                    </p>
                    <p className="text-4xl font-black text-[#071952]">
                      {selectedReport.totalAthletes}
                    </p>
                  </div>
                  <div className="bg-[#f2f3f6] rounded-2xl p-6 text-center border border-[#071952]/5">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                      Attendance
                    </p>
                    <p className="text-4xl font-black text-[#35a29f]">
                      {selectedReport.averageAttendance}
                    </p>
                  </div>
                </div>

                {/* HIGHLIGHTS */}
                {selectedReport.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.2em]">
                      Daily Highlights
                    </h4>
                    <div className="space-y-2">
                      {selectedReport.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-[#35a29f]/10 rounded-xl border border-[#35a29f]/20"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-[#35a29f] shrink-0"
                          />
                          <span className="text-sm font-bold text-[#071952]">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SESSIONS BREAKDOWN */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.2em]">
                    Sessions Summary
                  </h4>
                  <div className="space-y-2">
                    {selectedReport.sessionsSummary.map((session) => (
                      <div
                        key={session.sessionId}
                        className="p-4 bg-[#f2f3f6] rounded-2xl border border-[#071952]/5 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-black text-[#071952] uppercase italic">
                              {session.name}
                            </p>
                            <p className="text-[9px] font-bold text-[#071952]/40 uppercase tracking-widest mt-1">
                              {session.time}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-[#35a29f] text-white rounded-md text-[8px] font-black uppercase tracking-widest">
                            {session.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-[#088395]" />
                            <span className="text-[10px] font-black text-[#071952]">
                              {session.attended}/{session.capacity} Attended
                            </span>
                          </div>
                          <div className="flex-1 h-1.5 bg-[#f2f3f6] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#088395]"
                              style={{
                                width: `${(session.attended / session.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="p-8 border-t border-[#f2f3f6] bg-[#f2f3f6]/50 flex gap-3 shrink-0">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 py-4 bg-[#071952] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#088395] transition-all shadow-lg"
                >
                  Close Report
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

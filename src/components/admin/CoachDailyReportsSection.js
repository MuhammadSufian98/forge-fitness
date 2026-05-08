"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  Send,
  Loader2,
  FileText,
  Activity,
  Users,
  TrendingUp,
  X,
  ClipboardCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import useAuthStore from "@/stores/auth/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";

export default function CoachDailyReportsSection() {
  const { user } = useAuthStore();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: reportsData, isLoading } = useSWR(
    "/api/admin/reports",
    fetcher,
  );
  const reports = reportsData?.data || [];

  const [formData, setFormData] = useState({
    sessionHighlights: "",
    issuesEncountered: "",
    agendaForNextSession: "",
  });

  const handleAddReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const now = new Date();
      const payload = {
        ...formData,
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      const res = await axiosInstance.post("/api/admin/reports", payload);
      if (res.data.success) {
        mutate("/api/admin/reports");
        setIsAddModalOpen(false);
        setFormData({
          sessionHighlights: "",
          issuesEncountered: "",
          agendaForNextSession: "",
        });
      }
    } catch (error) {
      console.error("Failed to add report", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* 1. HEADER & STATS BENTO */}
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                  Daily <span className="text-[#088395]">Intelligence</span>
                </h1>
                <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em]">
                  Performance Logs & Tactical Session Analytics
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-[#071952] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-[#088395] transition-all shadow-xl shadow-[#071952]/20 group"
              >
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />{" "}
                Submit New Brief
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Total Reports",
                  val: reports.length,
                  icon: FileText,
                  color: "text-[#088395]",
                },
                {
                  label: "Avg Rating",
                  val: "4.9",
                  icon: TrendingUp,
                  color: "text-secondary",
                },
                {
                  label: "Active Month",
                  val: "May '26",
                  icon: Calendar,
                  color: "text-[#071952]",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[2rem] p-6 border border-[#071952]/5 flex items-center gap-5 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-[#f2f3f6] flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon size={22} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#071952]/30 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-xl font-black text-[#071952] italic">
                      {stat.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. REPORTS TIMELINE */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#088395]" size={40} />
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {reports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedReport(report)}
                  className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-[#071952]/5 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group flex items-center gap-8"
                >
                  <div className="shrink-0 text-center w-16">
                    <p className="text-[10px] font-black text-[#088395] uppercase tracking-widest leading-none">
                      {new Date(report.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-4xl font-black text-[#071952] mt-1 tracking-tighter">
                      {new Date(report.date).getDate()}
                    </p>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="text-[#088395]" size={16} />
                        <span className="text-xs font-black text-[#071952] uppercase tracking-widest">
                          {report.time}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-[#071952]/30 uppercase">
                          Synchronized
                        </span>
                      </div>
                      <ChevronRight
                        className="text-[#071952]/20 group-hover:text-[#088395] group-hover:translate-x-2 transition-all"
                        size={20}
                      />
                    </div>
                    <div className="bg-[#f2f3f6] rounded-2xl p-5 border border-white">
                      <p className="text-sm font-bold text-[#071952]/70 line-clamp-2 italic">
                        "{report.sessionHighlights}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* 3. EMPTY STATE */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 px-8 bg-white rounded-[4rem] border-2 border-dashed border-[#071952]/10 text-center"
            >
              <div className="w-24 h-24 bg-[#f2f3f6] rounded-[2.5rem] flex items-center justify-center mb-8">
                <ClipboardCheck size={40} className="text-[#071952]/10" />
              </div>
              <div className="max-w-sm space-y-4">
                <h3 className="text-3xl font-black text-[#071952] uppercase italic tracking-tighter">
                  No Logs Found
                </h3>
                <p className="text-[#071952]/40 text-sm font-bold uppercase tracking-widest">
                  Awaiting your first tactical report for the current month.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-10 px-10 py-5 bg-[#071952] text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#088395] transition-all"
              >
                Initialize Briefing
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 4. MODALS (ADD & DETAIL) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#071952]/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              <header className="p-10 pb-6 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                    Tactical{" "}
                    <span className="text-[#088395] not-italic">Brief</span>
                  </h3>
                  <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.2em]">
                    Submit Daily Operational Logs
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-4 hover:bg-[#f2f3f6] rounded-2xl transition-colors text-[#071952]/30 hover:text-[#071952]"
                >
                  <X size={24} />
                </button>
              </header>

              <form onSubmit={handleAddReport} className="p-10 pt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#f2f3f6] rounded-2xl">
                    <p className="text-[9px] font-black text-[#071952]/40 uppercase tracking-widest">
                      Protocol ID
                    </p>
                    <p className="text-xs font-black text-[#071952]">
                      {user?._id?.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="p-4 bg-[#f2f3f6] rounded-2xl">
                    <p className="text-[9px] font-black text-[#071952]/40 uppercase tracking-widest">
                      System Time
                    </p>
                    <p className="text-xs font-black text-[#071952]">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    "sessionHighlights",
                    "issuesEncountered",
                    "agendaForNextSession",
                  ].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-black text-[#088395] uppercase tracking-widest ml-2">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <textarea
                        required
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full p-5 bg-[#f2f3f6] rounded-[1.5rem] border-none text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395] transition-all min-h-[90px] resize-none"
                        placeholder={`Enter ${field.toLowerCase()}...`}
                      />
                    </div>
                  ))}
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-[#071952] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-[#088395] transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} /> Finalize Transmission
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL VIEW MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-[#071952]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-3xl bg-white rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 bg-[#071952] text-white shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-[#35a29f] rounded-full text-[8px] font-black uppercase tracking-widest">
                      Protocol Detail
                    </span>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                      {new Date(selectedReport.date).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" },
                      )}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-4 hover:bg-white/10 rounded-2xl transition-colors text-white/30 hover:text-white"
                  >
                    <X size={32} />
                  </button>
                </div>
              </div>

              <div className="p-10 flex-1 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#f2f3f6] rounded-[2.5rem] p-8 text-center border border-[#071952]/5">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                      Timestamp
                    </p>
                    <p className="text-5xl font-black text-[#071952] italic">
                      {selectedReport.time}
                    </p>
                  </div>
                  <div className="bg-[#f2f3f6] rounded-[2.5rem] p-8 flex flex-col justify-center items-center border border-[#071952]/5">
                    <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest mb-2">
                      Integrity Status
                    </p>
                    <div className="flex items-center gap-3 text-secondary">
                      <ClipboardCheck size={28} />
                      <span className="text-2xl font-black uppercase italic">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  {[
                    "sessionHighlights",
                    "issuesEncountered",
                    "agendaForNextSession",
                  ].map((section) => (
                    <div key={section} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-10 bg-[#088395] rounded-full" />
                        <h4 className="text-sm font-black text-[#071952] uppercase tracking-[0.2em]">
                          {section.replace(/([A-Z])/g, " $1")}
                        </h4>
                      </div>
                      <div className="p-8 bg-[#f2f3f6] rounded-[2.5rem] border border-white">
                        <p className="text-sm font-bold text-[#071952]/70 leading-relaxed italic">
                          "{selectedReport[section]}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="p-10 border-t border-[#f2f3f6] flex shrink-0">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full py-5 bg-[#071952] text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#088395] transition-all"
                >
                  Close Intelligence Brief
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

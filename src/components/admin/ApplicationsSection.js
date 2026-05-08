"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Inbox,
  X,
  User,
  Clock,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import useAuthStore from "@/stores/auth/useAuthStore";
import { leaveApi } from "@/utils/LeaveApi";

export default function ApplicationsSection() {
  const { user } = useAuthStore();
  const userRole = user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: appsData, isLoading } = useSWR(
    "/api/admin/applications",
    fetcher,
  );
  const applications = appsData?.data || [];

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await leaveApi.submitLeaveRequest(formData);
      if (result.success) {
        mutate("/api/admin/applications");
        setIsModalOpen(false);
        setFormData({ startDate: "", endDate: "", reason: "" });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Failed to submit application", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const result = await leaveApi.processApplication(applicationId, status);
      if (result.success) mutate("/api/admin/applications");
      else alert(result.message);
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="space-y-2">
            <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
              {userRole === "admin" ? "Administrative" : "Personal"}{" "}
              <span className="text-[#088395]">Requests</span>
            </h1>
            <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em]">
              Protocol Management & Leave Authorization
            </p>
          </header>

          <div className="w-full">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-8 w-full">
                {userRole === "coach" && (
                  <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-[#071952]/5 shadow-sm w-full">
                    <p className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest px-2">
                      Submit a new leave protocol
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-8 py-4 bg-[#071952] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#088395] transition-all shadow-xl"
                    >
                      <Plus size={16} /> New Application
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {applications.map((app, index) => (
                    <motion.div
                      key={app._id}
                      id={`app-${app._id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-white rounded-[3rem] p-10 border-2 shadow-sm space-y-6 overflow-hidden ${
                        app.status === "Approved"
                          ? "border-green-500/20 shadow-green-500/5"
                          : app.status === "Rejected"
                            ? "border-red-500/20 shadow-red-500/5"
                            : "border-[#071952]/5"
                      }`}
                    >
                      {/* Background Status Glow */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -mr-16 -mt-16 ${
                          app.status === "Approved"
                            ? "bg-green-500"
                            : app.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-amber-500"
                        }`}
                      />

                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${
                                app.status === "Approved"
                                  ? "bg-green-100 text-green-600"
                                  : app.status === "Rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-amber-100 text-amber-600"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  app.status === "Approved"
                                    ? "bg-green-500"
                                    : app.status === "Rejected"
                                      ? "bg-red-500"
                                      : "bg-amber-500 animate-pulse"
                                }`}
                              />
                              {app.status}
                            </span>
                          </div>

                          <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest pt-2 flex items-center gap-2">
                            <User size={12} className="text-[#088395]" />
                            {userRole === "admin"
                              ? app.coachId?.fullName
                              : "Identity Verified"}
                          </p>
                          <h4 className="font-black text-2xl text-[#071952] italic uppercase leading-none tracking-tighter">
                            {app.startDate}{" "}
                            <span className="text-[#088395] not-italic mx-1">
                              →
                            </span>{" "}
                            {app.endDate}
                          </h4>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-[#f2f3f6] flex items-center justify-center text-[#071952]/20">
                          <Calendar size={24} />
                        </div>
                      </div>

                      <div className="p-6 bg-[#f2f3f6] rounded-[2rem] relative z-10 border border-white/50">
                        <p className="text-[9px] font-black text-[#071952]/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Clock size={12} /> Objective Context
                        </p>
                        <p className="text-sm font-bold text-[#071952]/70 leading-relaxed italic">
                          "{app.reason}"
                        </p>
                      </div>

                      {userRole === "admin" && app.status === "Pending" && (
                        <div className="flex gap-4 pt-2 relative z-10">
                          <button
                            onClick={() =>
                              handleStatusUpdate(app._id, "Approved")
                            }
                            className="flex-1 py-4 bg-[#088395] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#071952] transition-all shadow-lg shadow-[#088395]/20 flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(app._id, "Rejected")
                            }
                            className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center justify-center py-32 px-10 bg-white rounded-[4rem] border-2 border-dashed border-[#071952]/10 text-center shadow-sm"
              >
                <div className="w-24 h-24 bg-[#f2f3f6] rounded-[3rem] flex items-center justify-center mb-10 shrink-0">
                  <Inbox
                    size={40}
                    className="text-[#071952]/20"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex flex-col items-center space-y-4 w-full px-4">
                  <h3 className="text-3xl md:text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                    Zero{" "}
                    <span className="text-[#088395] not-italic">
                      Applications
                    </span>{" "}
                    Found
                  </h3>

                  <p className="text-[#071952]/40 text-sm font-bold leading-relaxed uppercase tracking-[0.2em] max-w-3xl mx-auto">
                    No administrative requests are currently active in the
                    system terminal. All protocols finalized.
                  </p>
                </div>

                {userRole === "coach" && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-12 flex items-center gap-4 px-12 py-5 bg-[#071952] text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#088395] transition-all shadow-2xl group"
                  >
                    <Plus size={18} strokeWidth={3} />
                    Create First Request
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL REMAINING THE SAME WITH CORRECT MAX-W */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden"
            >
              <header className="p-10 pb-6 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-[#071952] uppercase italic leading-none tracking-tighter">
                    Request{" "}
                    <span className="text-[#088395] not-italic">Leave</span>
                  </h3>
                  <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.2em]">
                    Absence Protocol Initialization
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 hover:bg-[#f2f3f6] rounded-2xl transition-colors"
                >
                  <X size={28} className="text-[#071952]/40" strokeWidth={3} />
                </button>
              </header>
              <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#088395] uppercase tracking-widest ml-2">
                      Protocol Start
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-5 bg-[#f2f3f6] border-none rounded-2xl text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#088395] uppercase tracking-widest ml-2">
                      Protocol End
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full p-5 bg-[#f2f3f6] border-none rounded-2xl text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#088395] uppercase tracking-widest ml-2">
                    Objective Reason
                  </label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full p-6 bg-[#f2f3f6] border-none rounded-[2.5rem] text-sm font-bold text-[#071952] outline-none focus:ring-2 focus:ring-[#088395] transition-all min-h-[140px] resize-none"
                    placeholder="Provide details about your absence protocol..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-[#f2f3f6] text-[#071952]/40 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#071952]/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-[#071952] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#088395] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

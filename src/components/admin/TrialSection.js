"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  UserPlus,
  MousePointer2,
  BadgeCheck,
  MessageSquareText,
  Loader2,
} from "lucide-react";
import useTrialStore from "@/stores/admin/useTrialStore";

export default function TrialLeadsSection() {
  const {
    leads,
    isMailOpen,
    selectedLead,
    isLoading,
    setIsMailOpen,
    setSelectedLead,
    fetchLeads,
    replyToLead,
  } = useTrialStore();

  const [replyData, setReplyData] = useState({
    subject: "FORGE FITNESS // Your 7-Day Access Granted",
    message: ""
  });

  useEffect(() => {
    const handleDeepLink = (e) => {
      const { section, requestId } = e.detail;
      if (section === 'Trial' && leads.length > 0) {
        const target = leads.find(l => l._id === requestId);
        if (target) {
          handleReplyClick(target);
        }
      }
    };

    window.addEventListener('admin:deep-link', handleDeepLink);
    return () => window.removeEventListener('admin:deep-link', handleDeepLink);
  }, [leads]);

  const loadLeads = useCallback(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleReplyClick = (lead) => {
    setReplyData({
      subject: "FORGE FITNESS // Your 7-Day Access Granted",
      message: `Hello ${lead.name},\n\nYour request for ${lead.goal} has been approved. Your trial protocol starts tomorrow. Prepare for elite performance.\n\n-- Forge Management`,
    });
    setSelectedLead(lead);
    setIsMailOpen(true);
  };

  const handleFinalSend = async () => {
    if (selectedLead) {
      const result = await replyToLead(selectedLead._id, replyData.subject, replyData.message);
      if (!result.success) alert(result.message);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 pb-32 custom-scrollbar">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter">
              Priority <span className="text-[#088395]">Leads</span>
            </h1>
            <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
              Conversion Pipeline • Direct Dispatch
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#071952]/20"
              />
              <input
                placeholder="Filter leads..."
                className="bg-white border-none rounded-xl py-3 pl-12 pr-6 text-xs font-bold text-[#071952] shadow-sm w-64"
              />
            </div>
          </div>
        </header>

        {/* LEAD CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
          {isLoading && !leads.length && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
            </div>
          )}
          
          {leads.length === 0 ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#071952]/20">
                <MessageSquareText size={48} className="mb-4 opacity-20" />
                <p className="font-black uppercase italic tracking-widest text-xs">No pending leads in pipeline</p>
             </div>
          ) : (
            leads.map((lead) => (
              <motion.div
                key={lead._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#071952]/5 relative group hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#088395]/10 flex items-center justify-center text-[#088395] font-black text-xl italic">
                      {(lead.name || "A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#071952] uppercase italic leading-none">
                        {lead.name}
                      </h3>
                      <p className="text-[10px] font-bold text-[#071952]/40 mt-1 break-all">
                        {lead.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      lead.status === "Replied"
                        ? "bg-[#35a29f]/10 text-[#35a29f]"
                        : "bg-[#f2f3f6] text-[#071952]/40"
                    }`}
                  >
                    {lead.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-[#f2f3f6] text-[7px] font-black text-[#071952]/60 uppercase tracking-widest rounded-md border border-[#071952]/5">
                    GOAL: {lead.goal}
                  </span>
                  <span className="px-3 py-1 bg-[#f2f3f6] text-[7px] font-black text-[#071952]/60 uppercase tracking-widest rounded-md border border-[#071952]/5">
                    PHONE: {lead.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#f2f3f6]">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={lead.status === "Replied"}
                      readOnly
                      className="w-4 h-4 rounded border-[#071952]/10 accent-[#088395]"
                    />
                    <span className="text-[9px] font-black text-[#071952]/40 uppercase tracking-widest">
                      Mark as Contacted
                    </span>
                  </div>
                  <button
                    onClick={() => handleReplyClick(lead)}
                    className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      lead.status === "Replied"
                        ? "bg-[#f2f3f6] text-[#071952]/20 cursor-default"
                        : "bg-[#088395] text-white hover:bg-[#071952] shadow-lg"
                    }`}
                  >
                    {lead.status === "Replied" ? "Sent" : "Reply Now"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: ELITE MAIL DISPATCHER */}
      <AnimatePresence>
        {isMailOpen && selectedLead && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMailOpen(false)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
            >
              <div className="p-10 bg-[#071952] text-white flex flex-col justify-between shrink-0 relative">
                {isLoading && (
                   <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#071952]/60 backdrop-blur-[1px]">
                        <Loader2 className="animate-spin text-[#088395]" size={32} />
                   </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#088395] flex items-center justify-center animate-pulse">
                    <Send size={24} />
                  </div>
                  <button
                    onClick={() => setIsMailOpen(false)}
                    className="text-white/20 hover:text-white transition-colors"
                  >
                    <XCircle size={32} />
                  </button>
                </div>
                <div className="mt-6">
                  <span className="px-3 py-1 bg-[#35a29f] rounded-full text-[8px] font-black uppercase tracking-widest">
                    Inbound Response Terminal
                  </span>
                  <h2 className="text-3xl font-black uppercase italic mt-2 tracking-tighter leading-none">
                    Confirming Protocol:{" "}
                    <span className="text-[#088395]">{selectedLead.name}</span>
                  </h2>
                </div>
              </div>

              <div className="p-10 flex-1 overflow-y-auto space-y-6 no-scrollbar">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em] ml-2">
                    Protocol Subject
                  </label>
                  <input
                    className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold text-sm outline-none"
                    value={replyData.subject}
                    onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em] ml-2">
                    Transmission Body
                  </label>
                  <textarea
                    className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold text-sm min-h-[150px] outline-none resize-none"
                    value={replyData.message}
                    onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                  />
                </div>
              </div>

              <footer className="p-8 border-t border-[#f2f3f6] bg-[#f2f3f6]/50">
                <button
                  disabled={isLoading}
                  onClick={handleFinalSend}
                  className="w-full py-5 bg-[#071952] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#088395] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                >
                  Transmit Protocol to {selectedLead.email}{" "}
                  <BadgeCheck size={18} />
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

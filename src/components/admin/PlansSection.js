"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  ShieldCheck,
  XCircle,
  Edit3,
  X,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Filter
} from "lucide-react";
import usePlansStore from "@/stores/admin/usePlansStore";

export default function SubscriptionMatrix() {
  const {
    athletes,
    filter,
    selectedAthlete,
    isDrawerOpen,
    isLoading,
    setFilter,
    setSelectedAthlete,
    setIsDrawerOpen,
    fetchAthletes,
    approveSubscription,
  } = usePlansStore();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleDeepLink = (e) => {
      const { section, requestId } = e.detail;
      if (section === 'Plans' && athletes.length > 0) {
        const target = athletes.find(a => a._id === requestId);
        if (target) {
          setSelectedAthlete({ ...target });
          setIsDrawerOpen(true);
        }
      }
    };

    window.addEventListener('admin:deep-link', handleDeepLink);
    return () => window.removeEventListener('admin:deep-link', handleDeepLink);
  }, [athletes, setSelectedAthlete, setIsDrawerOpen]);

  const loadAthletes = useCallback(() => {
    fetchAthletes();
  }, [fetchAthletes]);

  useEffect(() => {
    loadAthletes();
  }, [loadAthletes]);

  const handleEdit = (athlete) => {
    setSelectedAthlete({ ...athlete });
    setIsDrawerOpen(true);
  };

  const handleAction = (action) => {
    if (selectedAthlete) {
      approveSubscription(selectedAthlete._id, action);
    }
  };

  const filteredBySearch = athletes.filter(a => 
    a.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredBySearch.filter(a => a.status === 'Pending');
  const activeDeployments = filteredBySearch.filter(a => a.status === 'Active');

  const getTierBadge = (tier) => {
    const colors = {
      elite: "bg-[#088395]/10 text-[#088395] border-[#088395]/20",
      pro: "bg-[#071952]/10 text-[#071952] border-[#071952]/20",
      basic: "bg-[#f2f3f6] text-[#071952]/40 border-[#071952]/10"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase border ${colors[tier.toLowerCase()] || colors.basic}`}>
        {tier}
      </span>
    );
  };

  return (
    <div className="h-full w-full bg-[#f2f3f6] flex flex-col overflow-hidden font-sans antialiased">
      <div className="flex-1 flex flex-col p-6 lg:p-10 space-y-10 min-h-0 overflow-y-auto custom-scrollbar pb-32">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
          <div>
            <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
              Plan <span className="text-[#088395]">Operations</span>
            </h1>
            <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
              Terminal Alpha • Subscription Lifecycle Control
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#071952]/20 group-focus-within:text-[#088395] transition-colors"
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete profile..."
                className="bg-white border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-[#071952] focus:ring-2 focus:ring-[#088395] shadow-sm w-64 lg:w-80 transition-all outline-none"
              />
            </div>
          </div>
        </header>

        {/* 1. PENDING AUTHORIZATIONS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Clock className="text-amber-500" size={20} />
              <h2 className="text-xs font-black text-[#071952] uppercase tracking-[0.4em]">Pending Authorizations</h2>
              <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.length === 0 ? (
              <div className="col-span-full py-12 bg-white/50 border-2 border-dashed border-[#071952]/5 rounded-[2.5rem] flex flex-col items-center justify-center text-[#071952]/20">
                <ShieldCheck size={40} className="mb-3 opacity-20" />
                <p className="font-black uppercase italic tracking-widest text-[10px]">All protocols verified</p>
              </div>
            ) : (
              pendingRequests.map((athlete) => (
                <motion.div
                  key={athlete._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-amber-500/20 shadow-xl shadow-amber-500/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <button 
                      onClick={() => handleEdit(athlete)}
                      className="p-3 bg-[#f2f3f6] text-[#071952] rounded-2xl hover:bg-[#071952] hover:text-white transition-all shadow-sm"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl italic shadow-inner">
                      {athlete.userInitials}
                    </div>
                    <div className="max-w-[150px]">
                      <h4 className="text-lg font-black text-[#071952] uppercase italic truncate leading-none">{athlete.userName}</h4>
                      <p className="text-[10px] font-bold text-[#071952]/40 truncate mt-1">{athlete.userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-[#071952]/20 uppercase tracking-widest">Requested Tier</span>
                      {getTierBadge(athlete.tier)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-[#071952]/20 uppercase tracking-widest">Time Applied</span>
                      <span className="text-[10px] font-bold text-[#071952]">{new Date(athlete.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    <button 
                      onClick={() => { setSelectedAthlete(athlete); approveSubscription(athlete._id, 'Approve'); }}
                      className="py-3 bg-amber-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => { setSelectedAthlete(athlete); approveSubscription(athlete._id, 'Reject'); }}
                      className="py-3 bg-[#f2f3f6] text-[#071952]/40 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* 2. ACTIVE DEPLOYMENTS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#088395]" size={20} />
              <h2 className="text-xs font-black text-[#071952] uppercase tracking-[0.4em]">Active Deployments</h2>
              <span className="bg-[#088395] text-white text-[9px] font-black px-2 py-0.5 rounded-full">{activeDeployments.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-[#071952]/5 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-[#071952] text-white/30 text-[8px] font-black uppercase tracking-[0.4em]">
                         <th className="px-10 py-6">Athlete Profile</th>
                         <th className="px-10 py-6">Current Tier</th>
                         <th className="px-10 py-6">Billing Intelligence</th>
                         <th className="px-10 py-6">Verification Date</th>
                         <th className="px-10 py-6 text-right">Review</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#f2f3f6]">
                      {activeDeployments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-[#071952]/20 font-black uppercase italic tracking-widest text-xs">
                            No active deployments found
                          </td>
                        </tr>
                      ) : (
                        activeDeployments.map((athlete) => (
                          <tr key={athlete._id} className="group hover:bg-[#088395]/5 transition-colors">
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-[#071952] text-white flex items-center justify-center font-black text-xs italic shadow-lg">
                                      {athlete.userInitials}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-[#071952] uppercase italic leading-none">{athlete.userName}</p>
                                      <p className="text-[9px] font-bold text-[#071952]/20 uppercase mt-1">{athlete.userEmail}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-6">
                                {getTierBadge(athlete.tier)}
                             </td>
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-[#071952] uppercase italic tracking-tighter">{athlete.billingCycle}</span>
                                   <span className="w-1 h-1 bg-[#071952]/10 rounded-full" />
                                   <span className="text-[9px] font-bold text-[#071952]/30 uppercase truncate max-w-[80px]">{athlete.paymentMethod}</span>
                                </div>
                             </td>
                             <td className="px-10 py-6">
                                <span className="text-[10px] font-bold text-[#071952]">{athlete.startDate ? new Date(athlete.startDate).toLocaleDateString() : 'N/A'}</span>
                             </td>
                             <td className="px-10 py-6 text-right">
                                <button 
                                  onClick={() => handleEdit(athlete)}
                                  className="p-3 bg-[#f2f3f6] text-[#071952]/20 rounded-2xl group-hover:bg-[#071952] group-hover:text-white transition-all shadow-sm"
                                >
                                   <ArrowRightLeft size={16} />
                                </button>
                             </td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </section>
      </div>

      {/* DRAWER COMPONENT */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#071952]/80 backdrop-blur-md z-[9999]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 w-[420px] bg-white z-[10000] shadow-2xl flex flex-col border-l border-[#071952]/5"
            >
              <div className="p-12 h-full flex flex-col space-y-10 overflow-y-auto custom-scrollbar relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#088395]" size={40} />
                  </div>
                )}
                
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="self-end p-2 bg-[#f2f3f6] rounded-xl text-[#071952]/20 hover:text-[#071952] transition-colors"
                >
                  <X size={24} />
                </button>

                <header>
                  <span className="text-[#088395] text-[10px] font-black uppercase tracking-[0.5em] block mb-2">Lifecycle Management</span>
                  <h2 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter">Review <span className="text-[#088395]">Protocol</span></h2>
                </header>

                {/* Identity Card */}
                <div className="p-6 bg-[#071952] rounded-[2.5rem] flex items-center gap-5 shrink-0 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#088395]/20 rounded-full blur-[60px] -mr-16 -mt-16" />
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center font-black italic text-2xl border border-white/20 relative z-10">
                    {selectedAthlete?.userInitials}
                  </div>
                  <div className="relative z-10">
                    <p className="text-xl font-black uppercase italic leading-none">{selectedAthlete?.userName}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">{selectedAthlete?.userEmail}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-[#f2f3f6] rounded-3xl space-y-4">
                    <label className="text-[10px] font-black text-[#088395] uppercase tracking-widest">Target Deployment Tier</label>
                    <div className="flex items-center justify-between">
                       <span className="font-black text-3xl text-[#071952] uppercase italic tracking-tighter">{selectedAthlete?.tier}</span>
                       {getTierBadge(selectedAthlete?.tier || 'basic')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-[#071952]/5 rounded-2xl">
                      <p className="text-[9px] font-black text-[#071952]/20 uppercase mb-2">Billing Cycle</p>
                      <p className="text-sm font-black text-[#071952] uppercase italic">{selectedAthlete?.billingCycle}</p>
                    </div>
                    <div className="p-5 bg-white border border-[#071952]/5 rounded-2xl">
                      <p className="text-[9px] font-black text-[#071952]/20 uppercase mb-2">Pay Method</p>
                      <p className="text-sm font-black text-[#071952] uppercase italic">{selectedAthlete?.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-white border border-[#071952]/5 rounded-2xl">
                    <p className="text-[9px] font-black text-[#071952]/20 uppercase mb-2">Internal Transaction Ref</p>
                    <p className="text-xs font-bold text-[#071952] font-mono break-all">{selectedAthlete?.transactionRef}</p>
                  </div>
                </div>

                <div className="mt-auto space-y-4 pt-10">
                  <button
                    disabled={selectedAthlete?.status === 'Active'}
                    onClick={() => handleAction('Approve')}
                    className="w-full py-6 bg-[#088395] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:bg-[#071952] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <CheckCircle2 size={20} /> 
                    {activeDeployments.some(a => a.userId === selectedAthlete?.userId) ? "Authorize Protocol Upgrade" : "Authorize Active Access"}
                  </button>
                  <button
                    disabled={selectedAthlete?.status === 'Rejected'}
                    onClick={() => handleAction('Reject')}
                    className="w-full py-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <XCircle size={20} /> Terminate Request
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

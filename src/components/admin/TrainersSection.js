"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  User,
  Mail,
  Lock,
  ShieldCheck,
  XCircle,
  Star,
  Activity,
  Calendar,
  Save,
  Trash2,
  X,
  Loader2,
  Users,
} from "lucide-react";
import useTrainersStore, { SPECIALIZATION_OPTIONS } from "@/stores/admin/useTrainersStore";

export default function TrainersSection() {
  const {
    trainers,
    isAddOpen,
    selectedTrainer,
    newTrainer,
    isLoading,
    setIsAddOpen,
    setSelectedTrainer,
    updateNewTrainer,
    addTrainer,
    fetchTrainers,
    updateTrainerStatus,
    offboardTrainer,
  } = useTrainersStore();

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleNewTrainerChange = (event) => {
    const { name, value } = event.target;
    updateNewTrainer(name, value);
  };

  const handleAddTrainer = async (event) => {
    event.preventDefault();
    const result = await addTrainer();
    if (!result.success) alert(result.message);
  };

  const handleStatusUpdate = async (status) => {
    if (selectedTrainer) {
      const result = await updateTrainerStatus(selectedTrainer._id, status);
      if (!result.success) alert(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to offboard this coach? Access will be revoked immediately.")) {
      const result = await offboardTrainer(id);
      if (result.success) setSelectedTrainer(null);
      else alert(result.message);
    }
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-32 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10 relative">
          {isLoading && !trainers.length && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <Loader2 className="animate-spin text-[#088395]" size={40} />
            </div>
          )}

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                Coach <span className="text-[#088395]">Roster</span>
              </h1>
              <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                Verified Performance Accreditation
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-[#071952] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#088395] transition-all shadow-xl group"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform"
              />{" "}
              Initialize Coach ID
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <motion.div
                key={trainer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-[#071952]/5 shadow-sm group hover:shadow-2xl transition-all p-8 flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-[1.8rem] bg-[#071952] text-white flex items-center justify-center text-2xl font-black italic shadow-xl overflow-hidden">
                    {trainer.profileImage ? (
                        <img src={trainer.profileImage} alt={trainer.fullName} className="w-full h-full object-cover" />
                    ) : (
                        (trainer.fullName || "C").split(" ").map((n) => n[0]).join("")
                    )}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${trainer.status === "Active" ? "bg-[#35a29f]" : "bg-red-500"}`}
                  />
                </div>

                <h3 className="text-lg font-black text-[#071952] uppercase italic leading-none">
                  {trainer.fullName}
                </h3>
                <p className="text-[9px] font-bold text-[#071952]/30 uppercase tracking-widest mt-2">
                  {trainer.accreditations?.[0] || 'Performance Coach'}
                </p>

                <div className="grid grid-cols-3 w-full mt-6 pt-6 border-t border-[#f2f3f6] gap-2">
                  <div>
                    <p className="text-[7px] font-black text-[#071952]/30 uppercase tracking-tighter">
                      Rating
                    </p>
                    <p className="text-xs font-black text-[#071952] mt-1 flex items-center justify-center gap-1">
                      <Star
                        size={8}
                        className="text-[#088395] fill-[#088395]"
                      />{" "}
                      {trainer.rating?.toFixed(1) || '5.0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-[#071952]/30 uppercase tracking-tighter">
                      Classes
                    </p>
                    <p className="text-xs font-black text-[#071952] mt-1">
                      {trainer.classesCount || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-[#071952]/30 uppercase tracking-tighter">
                      Status
                    </p>
                    <p
                      className={`text-[8px] font-black mt-1 uppercase ${trainer.status === "Active" ? "text-[#35a29f]" : "text-red-500"}`}
                    >
                      {trainer.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="w-full mt-6 py-3.5 bg-[#f2f3f6] text-[#071952] rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#071952] hover:text-white transition-all"
                >
                  View Full Intel
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* ADD COACH DRAWER */}
        {isAddOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="fixed inset-0 bg-[#071952]/60 backdrop-blur-sm z-[9998]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[380px] bg-white z-[9999] shadow-2xl flex flex-col border-l border-[#071952]/5"
            >
              <div className="p-10 flex flex-col h-full overflow-y-auto no-scrollbar relative">
                {isLoading && (
                   <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                        <Loader2 className="animate-spin text-[#088395]" size={32} />
                   </div>
                )}
                
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="self-end text-[#071952]/20 hover:text-[#071952] mb-4"
                >
                  <X size={24} />
                </button>

                <header className="mb-10">
                  <span className="text-[#088395] text-[9px] font-black uppercase tracking-[0.4em]">
                    Administration
                  </span>
                  <h2 className="text-3xl font-black text-[#071952] uppercase italic mt-1 tracking-tighter">
                    Deploy{" "}
                    <span className="text-[#088395] not-italic">Coach ID</span>
                  </h2>
                </header>

                <form onSubmit={handleAddTrainer} className="space-y-6 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-1">
                      Identity
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        name="name"
                        required
                        value={newTrainer.name}
                        onChange={handleNewTrainerChange}
                        placeholder="e.g. David Chen"
                        className="w-full bg-[#f2f3f6] rounded-xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#088395] border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-1">
                      Secure Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        name="email"
                        required
                        type="email"
                        value={newTrainer.email}
                        onChange={handleNewTrainerChange}
                        placeholder="coach@forge.com"
                        className="w-full bg-[#f2f3f6] rounded-xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#088395] border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-1">
                      Passkey
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        name="password"
                        required
                        value={newTrainer.password}
                        onChange={handleNewTrainerChange}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#f2f3f6] rounded-xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:ring-2 focus:ring-[#088395] border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#071952]/30 uppercase ml-1">
                      Specialization
                    </label>
                    <select
                      name="specialization"
                      value={newTrainer.specialization}
                      onChange={handleNewTrainerChange}
                      className="w-full bg-[#f2f3f6] rounded-xl py-4 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#088395] border-none"
                    >
                      {SPECIALIZATION_OPTIONS.map((specialization) => (
                        <option key={specialization} value={specialization}>
                          {specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-5 bg-[#071952] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#088395] transition-all flex items-center justify-center gap-3 mt-8 shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />} Initialize Access
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}

        {/* VIEW PROFILE MODAL */}
        {selectedTrainer && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrainer(null)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 bg-[#071952] text-white shrink-0 relative">
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#071952]/60 backdrop-blur-[1px]">
                        <Loader2 className="animate-spin text-[#088395]" size={32} />
                    </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black italic overflow-hidden">
                    {selectedTrainer.profileImage ? (
                        <img src={selectedTrainer.profileImage} alt={selectedTrainer.fullName} className="w-full h-full object-cover" />
                    ) : (
                        (selectedTrainer.fullName || "C")[0]
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="text-white/20 hover:text-white transition-colors"
                  >
                    <XCircle size={32} />
                  </button>
                </div>
                <div className="mt-4">
                  <span className="px-3 py-1 bg-[#35a29f] rounded-full text-[8px] font-black uppercase tracking-widest">
                    {selectedTrainer.accreditations?.[0] || 'Elite Trainer'}
                  </span>
                  <h2 className="text-3xl font-black uppercase italic mt-2 tracking-tighter">
                    {selectedTrainer.fullName}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mt-2">
                    {selectedTrainer.email}
                  </p>
                </div>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em]">
                      Global Status
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate('Active')}
                        className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${selectedTrainer.status === "Active" ? "bg-[#35a29f] text-white border-transparent shadow-lg" : "bg-[#f2f3f6] text-[#071952]/20 border-[#071952]/5"}`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('Inactive')}
                        className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all ${selectedTrainer.status === "Inactive" ? "bg-red-500 text-white border-transparent shadow-lg" : "bg-[#f2f3f6] text-[#071952]/20 border-[#071952]/5"}`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em]">
                      Identity Metadata
                    </h4>
                    <div className="p-3.5 bg-[#f2f3f6] rounded-xl border border-[#071952]/5">
                      <p className="text-[9px] font-bold text-[#071952]/60 uppercase italic">
                        ID: {selectedTrainer._id?.slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em]">
                    Live Performance
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        label: "Classes",
                        val: selectedTrainer.classesCount || 0,
                        icon: <Activity size={10} />,
                      },
                      {
                        label: "Rating",
                        val: selectedTrainer.rating?.toFixed(1) || '5.0',
                        icon: <Star size={10} />,
                      },
                      {
                        label: "Retention",
                        val: `${(selectedTrainer.retentionRate || 100).toFixed(0)}%`,
                        icon: <Users size={10} />,
                      },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#f2f3f6] rounded-2xl border border-[#071952]/5"
                      >
                        <div className="flex items-center gap-1.5 text-[#071952]/30 mb-1">
                          {m.icon}{" "}
                          <span className="text-[7px] font-black uppercase">
                            {m.label}
                          </span>
                        </div>
                        <p className="text-base font-black text-[#071952]">
                          {m.val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedTrainer.bio && (
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black text-[#088395] uppercase tracking-[0.2em]">
                      Biography Intel
                    </h4>
                    <p className="text-xs font-medium text-[#071952]/60 leading-relaxed">
                        {selectedTrainer.bio}
                    </p>
                  </div>
                )}
              </div>

              <footer className="p-6 border-t border-[#f2f3f6] bg-[#f2f3f6]/50 flex gap-3 shrink-0">
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="flex-1 py-4 bg-[#071952] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#088395] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save size={16} /> Close Terminal
                </button>
                <button 
                    onClick={() => handleDelete(selectedTrainer._id)}
                    className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTrainersStore from "@/stores/home/useTrainersStore";
import useSWR from "swr";
import { fetcher } from "@/utils/userAuth";
import {
  Star,
  Award,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Send,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function TrainersSection() {
  const selectedTrainer = useTrainersStore((state) => state.selectedTrainer);
  const activeFilter = useTrainersStore((state) => state.activeFilter);
  const rating = useTrainersStore((state) => state.rating);
  const setActiveFilter = useTrainersStore((state) => state.setActiveFilter);
  const openTrainer = useTrainersStore((state) => state.openTrainer);
  const closeTrainer = useTrainersStore((state) => state.closeTrainer);
  const setRating = useTrainersStore((state) => state.setRating);

  const { data: trainersData, isLoading, error } = useSWR("/api/trainers", fetcher);
  const trainers = trainersData?.data || [];

  const filters = ["All", "Strength", "HIIT", "Yoga", "Mobility"];

  // User Verification Data (Mocking your JSON structure)
  const userSessionData = {
    trainerId: "t1",
    userId: "u123",
    hasCompletedSession: false, // This toggles the rating UI
    lastSessionDate: "2026-04-20",
  };

  const filteredTrainers = trainers; // For now, we don't have category in the DB

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-[#071952] uppercase italic tracking-tighter">
              Elite <span className="text-[#088395]">Coaches</span>
            </h2>
            <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? "bg-[#071952] text-white shadow-lg" : "bg-white text-[#071952]/40 border border-[#071952]/5 hover:bg-[#088395]/10"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-[#088395]" size={40} />
              <p className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest">Recruiting Elites...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#071952]/40 font-bold uppercase tracking-widest">No active coaches found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#071952]">
              {filteredTrainers.map((trainer) => (
                <motion.div
                  key={trainer._id}
                  layoutId={`trainer-${trainer._id}`}
                  onClick={() => openTrainer(trainer)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-[#071952]/5 shadow-sm cursor-pointer group hover:shadow-xl transition-all"
                >
                  <div className="h-64 relative overflow-hidden bg-[#071952]/5 flex items-center justify-center">
                    {trainer.profileImage ? (
                      <img
                        src={trainer.profileImage}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={trainer.fullName}
                      />
                    ) : (
                      <Users size={48} className="text-[#071952]/10" />
                    )}
                    <div className="absolute top-6 right-6 bg-[#071952]/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white tracking-widest uppercase border border-white/20">
                      Performance Coach
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-2xl font-black uppercase italic">
                        {trainer.fullName}
                      </h3>
                      <div className="flex items-center gap-1 text-[#088395]">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold">
                          {trainer.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#071952]/40 text-xs font-bold uppercase tracking-widest mb-4">
                      {trainer.role || "Elite Trainer"}
                    </p>
                    <p className="text-sm text-[#071952]/60 line-clamp-2 mb-6">
                      {trainer.bio || "Dedicated to pushing the limits of human performance."}
                    </p>
                    <div className="flex items-center gap-2 text-[#088395] font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                      View Profile <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeTrainer}
              className="absolute inset-0 bg-[#071952]/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`trainer-${selectedTrainer._id}`}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            >
              <div className="lg:w-2/5 relative h-64 lg:h-auto bg-[#071952]/5 flex items-center justify-center">
                {selectedTrainer.profileImage ? (
                  <img
                    src={selectedTrainer.profileImage}
                    className="w-full h-full object-cover"
                    alt={selectedTrainer.fullName}
                  />
                ) : (
                  <Users size={80} className="text-[#071952]/10" />
                )}
              </div>

              <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar bg-white relative text-[#071952]">
                <button
                  onClick={closeTrainer}
                  className="absolute top-10 right-10 text-[#071952]/20 hover:text-[#071952] transition-colors"
                >
                  <XCircle size={32} />
                </button>

                <header className="mb-10">
                  <span className="text-[#088395] font-black text-[10px] uppercase tracking-[0.3em]">
                    Elite Performance Staff
                  </span>
                  <h2 className="text-5xl font-black uppercase italic mt-2 tracking-tighter leading-none">
                    {selectedTrainer.fullName}
                  </h2>
                </header>

                <section className="mb-10">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Biography
                  </h4>
                  <p className="text-[#071952]/70 leading-relaxed font-medium">
                    {selectedTrainer.bio || "No biography provided."}
                  </p>
                </section>

                {selectedTrainer.coachingPhilosophy && (
                  <section className="mb-10">
                    <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                      Philosophy
                    </h4>
                    <p className="text-[#071952]/70 leading-relaxed font-medium italic">
                      "{selectedTrainer.coachingPhilosophy}"
                    </p>
                  </section>
                )}

                <section className="mb-12">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Accreditations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.accreditations?.length > 0 ? (
                      selectedTrainer.accreditations.map((c, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-2 bg-[#f2f3f6] px-4 py-2 rounded-xl text-xs font-bold border border-[#071952]/5 shadow-sm"
                        >
                          <Award size={14} className="text-[#35a29f]" /> {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-[#071952]/40 uppercase">Certified Performance Coach</span>
                    )}
                  </div>
                </section>

                <div className="flex gap-4">
                  <button className="flex-1 py-5 bg-[#071952] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#088395] transition-all shadow-xl shadow-[#071952]/20">
                    Book Training
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

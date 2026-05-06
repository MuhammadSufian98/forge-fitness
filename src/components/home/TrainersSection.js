"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Award,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Send,
  CalendarDays,
} from "lucide-react";

export default function TrainersSection() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [rating, setRating] = useState(0);

  const filters = ["All", "Strength", "HIIT", "Yoga", "Mobility"];

  // User Verification Data (Mocking your JSON structure)
  const userSessionData = {
    trainerId: "t1",
    userId: "u123",
    hasCompletedSession: true, // This toggles the rating UI
    lastSessionDate: "2026-04-20",
  };

  //   {
  //   "id": "string",
  //   "name": "string",
  //   "title": "string",
  //   "specialty": "string",
  //   "rating": "number",
  //   "description": "string",
  //   "longBio": "string",
  //   "image": "url",
  //   "category": "string",
  //   "certifications": ["string"],
  //   "socials": { "instagram": "url", "linkedin": "url" },
  //   "stats": { "clients": "number", "experience": "string" }
  // }

  const trainers = [
    {
      id: "t1",
      name: "Marcus Thorne",
      title: "Masters in Kinesiology",
      specialty: "STRENGTH",
      rating: "4.9",
      description: "Specializing in powerlifting and athletic performance.",
      longBio:
        "Marcus has spent over 10 years training professional athletes. His approach combines traditional strength training with modern biomechanics to ensure maximum power output while maintaining joint longevity.",
      image:
        "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600",
      category: "Strength",
      stats: { clients: 500, experience: "12y" },
      certifications: [
        "CSCS Certified",
        "Precision Nutrition L1",
        "USAW Coach",
      ],
    },
    {
      id: "t2",
      name: "Sarah Chen",
      title: "Movement Specialist",
      specialty: "HIIT & MOBILITY",
      rating: "5.0",
      description:
        "Transform your conditioning with high-intensity recovery focus.",
      longBio:
        "Sarah bridges the gap between high-intensity performance and functional recovery. Her sessions are designed to push your cardiovascular limits while improving your overall range of motion.",
      image:
        "https://images.unsplash.com/photo-1548690312-e3b507d17a4d?auto=format&fit=crop&q=80&w=600",
      category: "HIIT",
      stats: { clients: 1200, experience: "8y" },
      certifications: ["NASM CPT", "FMS Level 2", "CrossFit L2"],
    },
  ];

  const filteredTrainers =
    activeFilter === "All"
      ? trainers
      : trainers.filter((t) => t.category === activeFilter);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[#071952]">
            {filteredTrainers.map((trainer) => (
              <motion.div
                key={trainer.id}
                layoutId={`trainer-${trainer.id}`}
                onClick={() => setSelectedTrainer(trainer)}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-[#071952]/5 shadow-sm cursor-pointer group hover:shadow-xl transition-all"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={trainer.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={trainer.name}
                  />
                  <div className="absolute top-6 right-6 bg-[#071952]/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black text-white tracking-widest uppercase border border-white/20">
                    {trainer.specialty}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-black uppercase italic">
                      {trainer.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#088395]">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">
                        {trainer.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#071952]/40 text-xs font-bold uppercase tracking-widest mb-4">
                    {trainer.title}
                  </p>
                  <p className="text-sm text-[#071952]/60 line-clamp-2 mb-6">
                    {trainer.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#088395] font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                    View Profile <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrainer(null)}
              className="absolute inset-0 bg-[#071952]/60 backdrop-blur-md"
            />

            <motion.div
              layoutId={`trainer-${selectedTrainer.id}`}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            >
              <div className="lg:w-2/5 relative h-64 lg:h-auto">
                <img
                  src={selectedTrainer.image}
                  className="w-full h-full object-cover"
                  alt={selectedTrainer.name}
                />
              </div>

              <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar bg-white relative text-[#071952]">
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-10 right-10 text-[#071952]/20 hover:text-[#071952] transition-colors"
                >
                  <XCircle size={32} />
                </button>

                <header className="mb-10">
                  <span className="text-[#088395] font-black text-[10px] uppercase tracking-[0.3em]">
                    {selectedTrainer.specialty}
                  </span>
                  <h2 className="text-5xl font-black uppercase italic mt-2 tracking-tighter leading-none">
                    {selectedTrainer.name}
                  </h2>
                </header>

                {/* VERIFIED RATING UI: Only visible if user has completed a session */}
                {userSessionData.hasCompletedSession &&
                  userSessionData.trainerId === selectedTrainer.id && (
                    <motion.section
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-10 p-6 bg-[#f2f3f6] rounded-[2rem] border border-[#088395]/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#35a29f]">
                          <CheckCircle size={16} strokeWidth={3} />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Verified Client Review
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#071952]/40 uppercase tracking-widest">
                          <CalendarDays size={12} />{" "}
                          {userSessionData.lastSessionDate}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className="transition-transform active:scale-90"
                            >
                              <Star
                                size={24}
                                fill={
                                  star <= rating ? "#088395" : "transparent"
                                }
                                className={
                                  star <= rating
                                    ? "text-[#088395]"
                                    : "text-[#071952]/10"
                                }
                              />
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <textarea
                            placeholder="Tell us how Marcus helped you crush your goals..."
                            className="w-full bg-white border border-[#071952]/5 rounded-2xl p-4 text-xs font-medium focus:ring-2 focus:ring-[#088395] outline-none min-h-[100px] shadow-inner"
                          />
                          <button className="absolute bottom-3 right-3 p-2 bg-[#071952] text-white rounded-xl hover:bg-[#088395] transition-all shadow-lg">
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.section>
                  )}

                <section className="mb-10">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Biography
                  </h4>
                  <p className="text-[#071952]/70 leading-relaxed font-medium">
                    {selectedTrainer.longBio}
                  </p>
                </section>

                <section className="mb-12">
                  <h4 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                    Accreditations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((c, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 bg-[#f2f3f6] px-4 py-2 rounded-xl text-xs font-bold border border-[#071952]/5 shadow-sm"
                      >
                        <Award size={14} className="text-[#35a29f]" /> {c}
                      </span>
                    ))}
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

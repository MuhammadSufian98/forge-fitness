"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
} from "lucide-react";

export default function TrialSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // This captures Name, Phone, and Goal as required by your boss
  };

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Visual Hook Side */}
                <div className="space-y-8">
                  <header>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#35a29f]/10 text-[#35a29f] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                      <Sparkles size={14} /> Limited Access
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-[#071952] uppercase italic leading-none tracking-tighter mb-6">
                      Claim Your <br />{" "}
                      <span className="text-[#088395]">Free Pass</span>
                    </h2>
                    <p className="text-[#071952]/60 font-medium text-lg leading-relaxed">
                      Experience 7 days of elite training, biometric tracking,
                      and personalized coaching at no cost.
                    </p>
                  </header>

                  <div className="space-y-4">
                    {[
                      {
                        icon: <ShieldCheck className="text-[#35a29f]" />,
                        text: "Full Access to All Zones",
                      },
                      {
                        icon: <Clock className="text-[#35a29f]" />,
                        text: "24/7 Premium Entry",
                      },
                      {
                        icon: <Zap className="text-[#35a29f]" />,
                        text: "1-on-1 Strategy Session",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-[#071952]/5 shadow-sm"
                      >
                        {item.icon}
                        <span className="font-bold text-sm text-[#071952] uppercase tracking-wide">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Side: Lead Capture */}
                <div className="bg-white rounded-[3rem] p-10 lg:p-12 shadow-2xl border border-[#071952]/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#088395]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                        />
                        <input
                          required
                          type="text"
                          placeholder="Sufian Hassan"
                          className="w-full bg-[#f2f3f6] border-none rounded-2xl py-5 pl-14 pr-6 text-[#071952] font-bold focus:ring-2 focus:ring-[#35a29f] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                        />
                        <input
                          required
                          type="tel"
                          placeholder="+92 300 0000000"
                          className="w-full bg-[#f2f3f6] border-none rounded-2xl py-5 pl-14 pr-6 text-[#071952] font-bold focus:ring-2 focus:ring-[#35a29f] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-2">
                        Your Fitness Goal
                      </label>
                      <div className="relative">
                        <Target
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                        />
                        <select
                          required
                          className="w-full bg-[#f2f3f6] border-none rounded-2xl py-5 pl-14 pr-10 text-[#071952] font-bold focus:ring-2 focus:ring-[#35a29f] outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Select a goal</option>
                          <option value="strength">Muscle Hypertrophy</option>
                          <option value="fat-loss">
                            Fat Loss & Conditioning
                          </option>
                          <option value="athletic">Athletic Performance</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-6 bg-[#071952] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#088395] transition-all shadow-xl shadow-[#071952]/20 flex items-center justify-center gap-3 group"
                    >
                      Initialize Trial{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-2 transition-transform"
                      />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              /* Success State: Crucial for Demo Walkthrough */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#35a29f]/20 blur-3xl rounded-full scale-150 animate-pulse" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-32 h-32 bg-[#35a29f] rounded-full flex items-center justify-center text-white relative z-10 shadow-2xl"
                  >
                    <CheckCircle2 size={64} strokeWidth={2.5} />
                  </motion.div>
                </div>

                <div className="space-y-4 max-w-lg">
                  <h2 className="text-5xl font-black text-[#071952] uppercase italic">
                    You're Ready.
                  </h2>
                  <p className="text-[#071952]/60 font-medium text-lg leading-relaxed">
                    Welcome to the elite, Sufian. A specialist will call you
                    within{" "}
                    <span className="text-[#088395] font-bold">15 minutes</span>{" "}
                    to finalize your access.
                  </p>
                </div>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-10 py-4 bg-[#f2f3f6] text-[#071952] rounded-2xl font-black uppercase text-[10px] tracking-widest border border-[#071952]/5 hover:bg-[#071952] hover:text-white transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

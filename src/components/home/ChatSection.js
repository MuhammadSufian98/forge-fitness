"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  PlusCircle,
  Sparkles,
  History,
  Settings,
  MoreHorizontal,
  Dumbbell,
  CheckCircle2,
  User,
} from "lucide-react";

export default function ChatSection() {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll logic for smooth conversational flow
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#f2f3f6] overflow-hidden font-sans">
      {/* 2. CONVERSATIONAL STREAM */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-10 space-y-10 custom-scrollbar pb-40"
      >
        <div className="max-w-4xl mx-auto flex flex-col space-y-10">
          <div className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#071952]/5 text-[9px] font-black text-[#071952]/40 uppercase tracking-[0.2em]">
              Today • May 07
            </span>
          </div>

          {/* AI Message: Motivating Persona */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 max-w-[85%] lg:max-w-[70%]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#088395] flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#088395]/20">
              <Dumbbell size={18} className="text-white" />
            </div>
            <div className="space-y-3">
              <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-[#071952]/5">
                <p className="text-sm text-[#071952] leading-relaxed font-medium">
                  Welcome back, <span className="font-black">Sufian</span>! ⚡️
                  You're at{" "}
                  <span className="text-[#088395] font-black">
                    92% readiness
                  </span>{" "}
                  today.
                </p>
                <p className="mt-4 text-sm text-[#071952] font-medium leading-relaxed">
                  Based on your goals, should we focus on{" "}
                  <span className="font-bold underline decoration-[#35a29f] decoration-2">
                    Hypertrophy
                  </span>{" "}
                  or{" "}
                  <span className="font-bold underline decoration-[#35a29f] decoration-2">
                    Explosive Cardio
                  </span>{" "}
                  today?
                </p>
              </div>
              {/* Quick Reply Buttons (Requirement: Never make user type unless necessary) */}
              <div className="flex flex-wrap gap-2">
                {["Elite Strength", "HIIT Session", "Active Recovery"].map(
                  (opt) => (
                    <motion.button
                      key={opt}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 bg-white border border-[#088395]/20 text-[#088395] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#088395] hover:text-white transition-all shadow-sm"
                    >
                      {opt}
                    </motion.button>
                  ),
                )}
              </div>
            </div>
          </motion.div>

          {/* User Message: Capturing Intent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4 self-end flex-row-reverse max-w-[85%] lg:max-w-[70%]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#071952] flex-shrink-0 flex items-center justify-center shadow-lg shadow-[#071952]/20 text-white font-black text-[10px]">
              SF
            </div>
            <div className="bg-[#071952] p-6 rounded-[2rem] rounded-tr-none text-white shadow-xl shadow-[#071952]/10">
              <p className="text-sm leading-relaxed font-medium">
                Feeling energized. Let's go with{" "}
                <span className="text-[#35a29f] font-bold italic uppercase">
                  Elite Strength
                </span>
                . Focus on lower body and core mechanics today.
              </p>
            </div>
          </motion.div>

          {/* AI Response: Success State */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 max-w-[85%] lg:max-w-[70%]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#088395] flex-shrink-0 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-[#35a29f]/20">
              <p className="text-sm text-[#071952] font-medium leading-relaxed italic">
                Understood. Initializing Titan Strength Protocol. Your personal
                trainer, Marcus, has been notified. 🏋️‍♂️
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. PRECISION COMMAND INPUT */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#f2f3f6] via-[#f2f3f6]/95 to-transparent pt-16 z-50"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 bg-white rounded-3xl p-2 pl-6 flex items-center gap-4 border border-[#071952]/5 shadow-2xl shadow-[#071952]/10">
            <button className="text-[#071952]/20 hover:text-[#088395] transition-all">
              <PlusCircle size={22} />
            </button>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Command your AI Coach..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-[#071952] placeholder:text-[#071952]/30 py-4 text-sm font-medium"
            />
            <AnimatePresence>
              {inputValue && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="p-3.5 bg-[#071952] text-white rounded-2xl shadow-lg hover:bg-[#088395] transition-all"
                >
                  <Send size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <button className="p-5 bg-white border border-[#071952]/5 rounded-3xl text-[#088395] hover:bg-[#071952] hover:text-white transition-all shadow-xl">
            <Mic size={22} />
          </button>
        </div>
        <p className="text-center text-[8px] font-black text-[#071952]/20 uppercase tracking-[0.4em] mt-4">
          Powered by Forge Intelligence v4.2 • Peak Performance Mode
        </p>
      </motion.footer>
    </div>
  );
}

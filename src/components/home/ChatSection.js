"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import useChatStore from "@/stores/home/useChatStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import {
  Send,
  Sparkles,
  Cpu,
  Mic,
  PlusCircle,
  Zap,
  Target,
  Flame,
} from "lucide-react";

// Typewriter Component for the "Live Response" feel
const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 15); // Tactical speed
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return <span>{displayedText}</span>;
};

export default function ChatSection() {
  const {
    inputValue,
    setInputValue,
    clearInput,
    messages,
    isLoading,
    sendMessage,
    loadHistory,
  } = useChatStore();
  const { user } = useAuthStore();
  const scrollRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e, quickText = null) => {
    if (e) e.preventDefault();
    const userMsg = quickText || inputValue.trim();
    if (!userMsg || isLoading) return;

    clearInput();
    await sendMessage(userMsg, user);
  };

  const suggestions = [
    {
      label: "Optimal Protocol",
      icon: <Target size={14} />,
      text: "What is my optimal training protocol for today?",
    },
    {
      label: "Nutritional Intel",
      icon: <Flame size={14} />,
      text: "Generate a high-protein meal plan for my current goal.",
    },
    {
      label: "Recovery Sync",
      icon: <Zap size={14} />,
      text: "How can I improve my recovery after a heavy leg session?",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#f2f3f6] overflow-hidden font-sans">
      {/* 1. CONVERSATIONAL STREAM */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-10 space-y-10 custom-scrollbar pb-40"
      >
        <div className="max-w-4xl mx-auto flex flex-col space-y-10">
          <div className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#071952]/5 text-[9px] font-black text-[#071952]/40 uppercase tracking-[0.2em]">
              Protocol Session •{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </span>
          </div>

          {/* EMPTY STATE / SUGGESTIONS */}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-[#071952] rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(7,25,82,0.3)] border border-white/10">
                <Sparkles
                  size={44}
                  className="text-[#35a29f]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#071952] tracking-tighter uppercase italic">
                  AI Coach
                  <span className="text-[#088395] not-italic">Online</span>
                </h2>
                <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.4em]">
                  Select inquiry to begin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(null, s.text)}
                    className="p-5 bg-white border border-[#071952]/5 rounded-3xl flex flex-col items-center gap-3 hover:border-[#088395] hover:shadow-xl transition-all group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#f2f3f6] flex items-center justify-center text-[#088395] group-hover:bg-[#088395] group-hover:text-white transition-colors">
                      {s.icon}
                    </div>
                    <span className="text-[10px] font-black text-[#071952] uppercase tracking-widest">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse self-end max-w-[85%] lg:max-w-[70%]" : "max-w-[85%] lg:max-w-[70%]"}`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                  msg.role === "ai"
                    ? "bg-[#088395] shadow-[#088395]/20"
                    : "bg-[#071952] shadow-[#071952]/20"
                }`}
              >
                {msg.role === "ai" ? (
                  <Sparkles size={20} className="text-white" />
                ) : (
                  <span className="text-white font-black text-[11px] uppercase italic">
                    {user?.fullName?.substring(0, 2)}
                  </span>
                )}
              </div>

              <div
                className={`flex flex-col space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-6 rounded-[2.5rem] shadow-sm border ${
                    msg.role === "ai"
                      ? "bg-white border-[#071952]/5 text-[#071952] rounded-tl-none"
                      : "bg-[#071952] border-transparent text-white rounded-tr-none shadow-xl"
                  }`}
                >
                  <p className="text-sm leading-relaxed font-medium italic">
                    {msg.role === "ai" && idx === messages.length - 1 ? (
                      <Typewriter text={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </p>
                </div>
                <span className="text-[8px] font-black text-[#071952]/20 uppercase tracking-widest px-2">
                  {msg.role === "ai" ? "Forge Intelligence" : "Athlete Sync"}
                </span>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 text-[#088395]"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#088395]/10 flex items-center justify-center">
                <Cpu size={20} className="animate-spin" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">
                [Analyzing Biometrics...]
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. COMMAND INPUT */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#f2f3f6] via-[#f2f3f6]/95 to-transparent pt-16 z-50"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <form
            onSubmit={handleSendMessage}
            className="flex-1 bg-white rounded-[2rem] p-2 pl-6 flex items-center gap-4 border border-[#071952]/5 shadow-2xl shadow-[#071952]/10"
          >
            <button
              type="button"
              className="text-[#071952]/20 hover:text-[#088395] transition-all"
            >
              <PlusCircle size={24} />
            </button>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Initialize Intelligence Command..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-[#071952] placeholder:text-[#071952]/20 py-5 text-sm font-bold uppercase tracking-tight"
              disabled={isLoading}
            />
            <AnimatePresence>
              {inputValue && (
                <motion.button
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  type="submit"
                  className="p-4 bg-[#071952] text-white rounded-2xl shadow-lg hover:bg-[#088395] transition-all"
                >
                  <Send size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </form>
          <button className="p-6 bg-white border border-[#071952]/5 rounded-[2rem] text-[#088395] hover:bg-[#071952] hover:text-white transition-all shadow-xl group">
            <Mic
              size={24}
              className="group-hover:scale-110 transition-transform"
            />
          </button>
        </div>
        <p className="text-center text-[8px] font-black text-[#071952]/20 uppercase tracking-[0.4em] mt-6">
          Forge Intelligence v4.2 • Llama-3-70B • End-to-End Encryption Active
        </p>
      </motion.footer>
    </div>
  );
}

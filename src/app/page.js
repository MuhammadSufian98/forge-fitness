"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Dumbbell,
  Calendar,
  User,
  Info,
  CheckCircle,
} from "lucide-react";

export default function GymChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Welcome to PeakForm Gym! 🏋️‍♂️ Ready to crush your goals today?",
      hasOptions: true,
    },
  ]);
  const [step, setStep] = useState("menu"); // menu, plans, booking, lead-capture, success

  const handleOption = (option) => {
    const userMsg = { id: Date.now(), type: "user", text: option };
    setMessages((prev) => [...prev, userMsg]);

    // Logic for branching paths
    setTimeout(() => {
      if (option === "Membership Plans") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "bot",
            text: "We have 3 flexible plans: Basic ($29), Pro ($49), and Elite ($79). Which one interests you?",
            isPlans: true,
          },
        ]);
      } else if (option === "Free Consultation") {
        setStep("lead-capture");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "bot",
            text: "Great choice! First, what is your full name?",
          },
        ]);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 flex items-center justify-center p-4">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      {/* Glassmorphic Chat Container */}
      <main className="relative z-10 w-full max-w-2xl h-[85vh] bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Dumbbell size={20} className="text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">PeakForm Bot</h1>
              <p className="text-xs text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
                Online
              </p>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.type === "user"
                      ? "bg-cyan-600 text-white rounded-tr-none"
                      : "bg-white/10 backdrop-blur-md border border-white/10 rounded-tl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>

                  {msg.hasOptions && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "Membership Plans",
                        "Class Schedule",
                        "Free Consultation",
                        "FAQs",
                      ].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOption(opt)}
                          className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-xs hover:bg-cyan-500 hover:text-black transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Field (Lead Capture Mode) */}
        <footer className="p-6 border-t border-white/10 bg-white/5">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={
                step === "lead-capture"
                  ? "Type your answer here..."
                  : "Select an option above..."
              }
              disabled={step !== "lead-capture"}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50"
            />
            <button className="absolute right-2 p-2 bg-cyan-500 rounded-full text-black hover:scale-105 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Sparkles, Headset, Mail } from "lucide-react";

export default function DesktopHeader({
  activeSection,
  isSidebarShrunk,
  toggleSidebar,
  setActiveSection,
}) {
  if (activeSection === "Home") {
    return (
      <header className="sticky top-0 z-10 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="max-w-md w-full">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-secondary text-[14px] placeholder:text-on-surface-variant/40"
                placeholder="Search exercises, routines..."
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("Contact");
            }}
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
          >
            <Headset />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            New Workout
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Plans") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                fitness_center
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Training Plans</h1>
              <p className="text-[12px] text-on-surface-variant/70">
                Compare tiers & benefits
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            Upgrade Tier
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Schedule") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_month
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Class Schedule</h1>
              <p className="text-[12px] text-on-surface-variant/70">
                Manage your weekly training
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            Book Session
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Trainers") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Elite Trainers</h1>
              <p className="text-[12px] text-on-surface-variant/70">
                World-class coaching specialists
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            Find a Coach
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Trial") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">
                Elite Access Trial
              </h1>
              <p className="text-[12px] text-on-surface-variant/70">
                Start your 7-day journey
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            Get Help
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Profile") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isSidebarShrunk ? "menu_open" : "menu"}
              </span>
            </button>
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Member Profile</h1>
              <p className="text-[12px] text-on-surface-variant/70">
                Manage your personal fitness data
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-secondary/20"
          >
            Edit Profile
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "Contact") {
    return (
      <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant px-8 py-4 hidden lg:flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-surface-container transition-colors text-primary flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isSidebarShrunk ? "menu_open" : "menu"}
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">Direct Inquiry</h1>
              <p className="text-[12px] text-on-surface-variant/70">
                Priority support channels
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-secondary/20"
          >
            Send Message
          </motion.button>
        </div>
      </header>
    );
  }

  if (activeSection === "AI Coach") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 px-6 pb-4 border-b border-primary/5 bg-surface/40 backdrop-blur-xl sticky top-0 z-40 hidden lg:block"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-primary/5 transition-colors text-primary flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isSidebarShrunk ? "menu_open" : "menu"}
              </span>
            </button>
            <div className="relative">
              <div className="w-12 h-12 bg-[#E5EEF2] rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles size={24} className="text-secondary" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-lg font-black text-primary-container uppercase italic tracking-tighter leading-none flex items-center gap-2">
                PeakForm AI{" "}
                <span className="px-2 py-0.5 bg-[#088395]/10 text-[#088395] text-[8px] rounded-full not-italic tracking-widest font-black">
                  ACTIVE
                </span>
              </h1>
              <p className="text-[10px] font-bold text-primary-container/40 uppercase tracking-widest mt-1">
                Personalized Performance Coach
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="p-2 rounded-xl hover:bg-primary/5 transition-colors text-on-surface-variant/60 hover:text-primary">
              <span className="material-symbols-outlined text-xl">history</span>
            </button>
            <button className="p-2 rounded-xl hover:bg-primary/5 transition-colors text-on-surface-variant/60 hover:text-primary">
              <span className="material-symbols-outlined text-xl">
                settings
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

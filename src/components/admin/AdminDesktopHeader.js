"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, BarChart3, Search } from "lucide-react";

export default function AdminDesktopHeader({ activeSection, isSidebarShrunk, toggleSidebar }) {
  const titleMap = {
    Dashboard: {
      title: "Executive Dashboard",
      subtitle: "Operations overview",
      icon: <span className="material-symbols-outlined">dashboard</span>,
      button: "Create Report",
    },
    Home: {
      title: "Executive Dashboard",
      subtitle: "Operations overview",
      icon: <span className="material-symbols-outlined">dashboard</span>,
      button: "Create Report",
    },
    Plans: {
      title: "Subscription Matrix",
      subtitle: "Member tiers & access",
      icon: <span className="material-symbols-outlined">payments</span>,
      button: "Export Data",
    },
    Schedule: {
      title: "Operations Schedule",
      subtitle: "Hub traffic & staff",
      icon: <span className="material-symbols-outlined">calendar_month</span>,
      button: "Add Slot",
    },
    Trainers: {
      title: "Roster Management",
      subtitle: "Performance & metrics",
      icon: <span className="material-symbols-outlined">person</span>,
      button: "Add Trainer",
    },
    Trial: {
      title: "Trial Conversions",
      subtitle: "Pipeline analysis",
      icon: <span className="material-symbols-outlined">workspace_premium</span>,
      button: "Download CSV",
    },
  };

  const current = titleMap[activeSection] ?? titleMap.Dashboard;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-outline-variant/30 px-container-padding h-16 hidden lg:flex items-center justify-between transition-all duration-500">
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
          <div className="text-primary flex items-center justify-center">
            {current.icon}
          </div>
          <h1 className="font-h3 text-h3 text-primary">{current.title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-lg">
        {/* Search Bar */}
        <div className="flex items-center bg-surface-container rounded-full px-md py-1 border border-outline-variant/30 focus-within:border-secondary transition-colors group">
          <span className="material-symbols-outlined text-outline text-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md placeholder:text-outline-variant w-48 py-1"
            placeholder="Search systems..."
            type="text"
          />
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
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            {current.button}
          </motion.button>
        </div>
      </div>
    </header>
  );
}


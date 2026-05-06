"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, BarChart3 } from "lucide-react";

export default function AdminDesktopHeader({ activeSection, isSidebarShrunk, toggleSidebar }) {
  const titleMap = {
    Dashboard: {
      title: "Admin Dashboard",
      subtitle: "Monitor platform activity",
      icon: <ShieldCheck className="h-5 w-5" />,
      button: "Create Report",
    },
    Users: {
      title: "User Management",
      subtitle: "Manage members and staff",
      icon: <Users className="h-5 w-5" />,
      button: "Add User",
    },
    Reports: {
      title: "Reports",
      subtitle: "Review trends and metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      button: "Export Data",
    },
    Schedule: {
      title: "Operations Schedule",
      subtitle: "Track admin workflows",
      icon: <span className="material-symbols-outlined text-xl">event</span>,
      button: "Add Slot",
    },
    Settings: {
      title: "System Settings",
      subtitle: "Configure platform options",
      icon: <span className="material-symbols-outlined text-xl">settings</span>,
      button: "Save Changes",
    },
  };

  const current = titleMap[activeSection] ?? titleMap.Dashboard;

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
            {current.icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">{current.title}</h1>
            <p className="text-[12px] text-on-surface-variant/70">{current.subtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-surface-container transition-colors group">
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
        >
          {current.button}
        </motion.button>
      </div>
    </header>
  );
}

"use client";

import { motion } from "framer-motion";

export default function AdminHeader() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 lg:hidden bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-container-padding h-16"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary text-white flex items-center justify-center">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          admin_panel_settings
        </span>
      </div>
      <h1 className="font-h2 text-h2 tracking-tighter text-primary dark:text-primary-fixed">ADMIN PANEL</h1>
      <button className="active:scale-95 transition-all hover:opacity-80">
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">notifications</span>
      </button>
    </motion.header>
  );
}

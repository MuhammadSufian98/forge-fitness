"use client";

import { motion } from "framer-motion";
import useHomeShellStore from "@/stores/home/useHomeShellStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";

export default function Sidebar({ isGuest = false }) {
  const { user, logout } = useAuthStore();
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const setActiveSection = useHomeShellStore((state) => state.setActiveSection);
  const isShrunk = useHomeShellStore((state) => state.isSidebarShrunk);
  const menuItems = [
    { icon: "home", label: "Home" },
    { icon: "fitness_center", label: "Plans" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "card_membership", label: "Trial" },
    ...(!isGuest
      ? [
          { icon: "groups", label: "Trainers" },
          { icon: "smart_toy", label: "AI Coach", fill: true },
        ]
      : []),
  ];

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isShrunk ? 80 : 256,
        paddingLeft: isShrunk ? 16 : 24,
        paddingRight: isShrunk ? 16 : 24,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen hidden lg:flex flex-col bg-surface/80 backdrop-blur-3xl border-r border-primary/5 shadow-2xl py-6 gap-4 z-50 overflow-hidden"
    >
      <div
        className={`flex flex-col gap-1 mb-6 ${isShrunk ? "items-center" : ""}`}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20 cursor-pointer shrink-0"
        >
          <span
            className="material-symbols-outlined text-white text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            fitness_center
          </span>
        </motion.div>
        {!isShrunk && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col"
          >
            <span className="text-xl font-black text-primary tracking-tighter whitespace-nowrap">
              FORGE FITNESS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 whitespace-nowrap">
              Elite Performance
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.label;
          return (
            <motion.a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.label);
              }}
              whileHover={{ x: isShrunk ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center transition-all rounded-2xl group relative overflow-hidden h-12 ${
                isShrunk ? "justify-center w-12" : "gap-4 p-3.5"
              } ${
                isActive
                  ? "text-primary font-bold bg-primary/5"
                  : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={`absolute left-0 bg-primary rounded-full ${isShrunk ? "top-1 bottom-1 w-1.5" : "top-2 bottom-2 w-1"}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant/70 group-hover:text-primary"
                }`}
                style={
                  item.fill || isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {item.icon}
              </span>
              {!isShrunk && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[14px] tracking-tight whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.a>
          );
        })}
      </div>

      <div className={`mt-auto pt-6 border-t border-primary/5 flex items-center p-2 ${isShrunk ? "flex-col gap-4" : "justify-between"}`}>
        <div
          onClick={() => {
            if (!isGuest) setActiveSection("Profile");
          }}
          className={`flex items-center transition-colors rounded-2xl p-2 flex-1 ${!isGuest ? "cursor-pointer hover:bg-primary/5" : ""} ${isShrunk ? "justify-center" : "gap-3"}`}
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-black italic shadow-lg overflow-hidden ring-2 ring-primary/10">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "G"
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
          </div>
          {!isShrunk && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="font-bold text-[13px] text-primary whitespace-nowrap truncate max-w-[120px]">
                {user?.fullName || "Guest"}
              </span>
              <span className="text-[11px] text-on-surface-variant/70 font-medium whitespace-nowrap uppercase tracking-tighter">
                {isGuest ? "Preview Access" : `${user?.subscriptionTier || "Basic"} Member`}
              </span>
            </motion.div>
          )}
        </div>

        {isGuest ? (
          <Link
            href="/auth/login"
            className={`p-2.5 text-on-surface-variant/40 hover:text-[#088395] hover:bg-[#088395]/10 transition-all rounded-xl ${isShrunk ? "" : "ml-2"}`}
            title="Sign In"
          >
            <LogIn size={18} />
          </Link>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
            className={`p-2.5 text-on-surface-variant/40 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl ${isShrunk ? "" : "ml-2"}`}
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </motion.nav>
  );
}

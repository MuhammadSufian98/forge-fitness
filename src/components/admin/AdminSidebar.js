"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogIn, User, LogOut } from "lucide-react";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  isShrunk,
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const userRole = user?.role;

  // Role-based menu items
  const adminMenuItems = [
    { icon: "home", label: "Home" },
    { icon: "fitness_center", label: "Plans" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "person", label: "Trainers" },
    { icon: "workspace_premium", label: "Trial" },
  ];

  const coachMenuItems = [
    { icon: "home", label: "Home" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "assessment", label: "Daily Reports" },
  ];

  const menuItems = userRole === "coach" ? coachMenuItems : adminMenuItems;

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??";

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isShrunk ? 80 : 256,
        paddingLeft: isShrunk ? 16 : 24,
        paddingRight: isShrunk ? 16 : 24,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen hidden lg:flex flex-col bg-primary-container text-white py-xl gap-4 z-[60] overflow-hidden"
    >
      <div
        className={`flex flex-col mb-xl ${isShrunk ? "items-center" : "px-container-padding"}`}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 bg-primary-fixed rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20 cursor-pointer shrink-0"
        >
          <span
            className="material-symbols-outlined text-primary-container text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            fitness_center
          </span>
        </motion.div>
        {!isShrunk ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="font-h3 text-h3 tracking-tighter text-primary-fixed leading-tight">
              FORGE FITNESS
            </h1>
            <p className="font-label-caps text-label-caps text-primary-fixed-dim/60 mt-xs uppercase">
              EXECUTIVE CONTROL
            </p>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-2 shadow-lg cursor-pointer shrink-0"
          >
            <span
              className="material-symbols-outlined text-primary-fixed text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              fitness_center
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive =
            activeSection === item.label ||
            (activeSection === "Dashboard" && item.label === "Home");
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
              className={`flex items-center transition-all rounded-lg group relative overflow-hidden h-12 ${
                isShrunk ? "justify-center w-12" : "gap-md px-md"
              } ${
                isActive
                  ? "text-secondary-fixed bg-white/10"
                  : "text-on-primary-container hover:bg-white/5"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110 shrink-0`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              {!isShrunk && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-body-lg text-body-lg whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.a>
          );
        })}
      </div>

      <div className={`mt-auto ${isShrunk ? "items-center px-2" : "px-md"}`}>
        {isAuthenticated && user ? (
          <div
            className={`glass-panel rounded-xl bg-white/5 border-white/10 border backdrop-blur-md flex items-center ${isShrunk ? "flex-col p-2 gap-4" : "p-2 justify-between"}`}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("Profile");
              }}
              className={`flex items-center cursor-pointer overflow-hidden ${isShrunk ? "justify-center" : "gap-sm flex-1"}`}
            >
              <div className="w-10 h-10 rounded-full border border-primary-fixed-dim bg-[#071952] flex items-center justify-center text-[10px] font-black italic shrink-0 overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {!isShrunk && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <p className="font-body-md text-body-md font-bold text-white truncate">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-widest">
                    {user.role} ID: {user._id?.substring(0, 4).toUpperCase()}
                  </p>
                </motion.div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="p-2 text-primary-fixed-dim hover:text-white hover:bg-white/10 transition-all rounded-lg"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="glass-panel p-md rounded-xl bg-white/5 border-white/10 border backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
            <button
              onClick={() => router.push("/auth/login")}
              className="flex items-center gap-sm w-full"
            >
              <div className="w-10 h-10 rounded-full border border-primary-fixed-dim bg-primary-fixed/20 flex items-center justify-center">
                <LogIn size={18} className="text-primary-fixed" />
              </div>
              {!isShrunk && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <p className="font-body-md text-body-md font-bold text-white truncate">
                    Sign In
                  </p>
                  <p className="text-[10px] text-primary-fixed-dim uppercase tracking-widest">
                    Login Required
                  </p>
                </motion.div>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

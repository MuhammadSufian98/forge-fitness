"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogIn, User, LogOut, AlertCircle } from "lucide-react";
import useAuthStore from "@/stores/auth/useAuthStore";
import useSWR from "swr";
import { fetcher } from "@/utils/userAuth";
import { useEffect, useState } from "react";

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  isShrunk,
}) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const userRole = user?.role;
  const [showWarning, setShowWarning] = useState(false);

  const { data: reportsData } = useSWR(
    userRole === "coach" ? "/api/admin/reports" : null,
    fetcher
  );

  useEffect(() => {
    if (userRole === "coach" && reportsData?.success) {
      const today = new Date().toISOString().split("T")[0];
      const hasReportToday = reportsData.data.some(r => r.date === today);
      const currentHour = new Date().getHours();
      
      if (currentHour >= 20 && !hasReportToday) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  }, [reportsData, userRole]);

  // Role-based menu items
  const adminMenuItems = [
    { icon: "home", label: "Home" },
    { icon: "fitness_center", label: "Plans" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "person", label: "Trainers" },
    { icon: "workspace_premium", label: "Trial" },
    { icon: "description", label: "Applications" },
  ];

  const coachMenuItems = [
    { icon: "home", label: "Home" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "assessment", label: "Daily Reports", warning: true },
    { icon: "description", label: "Applications" },
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
          ""
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
                  className="font-body-lg text-body-lg whitespace-nowrap flex-1"
                >
                  {item.label}
                </motion.span>
              )}
              {item.warning && showWarning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <AlertCircle size={16} className="text-amber-500" />
                </motion.div>
              )}
            </motion.a>
          );
        })}
      </div>

      <div className={`mt-auto ${isShrunk ? "items-center px-2" : "px-md"}`}>
        {isAuthenticated && user ? (
          <div
            className={`rounded-[1.25rem] bg-[#071952] border border-[#35a29f]/20 shadow-2xl flex items-center ${
              isShrunk ? "flex-col p-2 gap-4" : "p-2.5 justify-between"
            }`}
          >
            <div
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("Profile");
              }}
              className={`flex items-center cursor-pointer overflow-hidden ${
                isShrunk ? "justify-center" : "gap-3 flex-1"
              }`}
            >
              <div className="w-10 h-10 rounded-[1rem] border-2 border-[#35a29f] bg-[#071952] flex items-center justify-center text-white text-[10px] font-black italic shrink-0 overflow-hidden shadow-xl">
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
                  <p className="font-body-md text-sm font-bold text-white truncate uppercase tracking-tight italic">
                    {user.fullName}
                  </p>
                  <p className="text-[9px] font-black text-[#35a29f] uppercase tracking-widest leading-none">
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
              className="p-3 text-white/50 hover:text-white hover:bg-[#35a29f] transition-all rounded-[1rem] flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="rounded-[1.25rem] p-4 bg-[#071952] border border-[#35a29f]/20 hover:bg-[#35a29f]/5 transition-all cursor-pointer shadow-2xl">
            <button
              onClick={() => router.push("/auth/login")}
              className="flex items-center gap-3 w-full"
            >
              <div className="w-10 h-10 rounded-[1rem] border-2 border-[#35a29f] bg-white/5 flex items-center justify-center shadow-xl">
                <LogIn size={18} className="text-[#35a29f]" />
              </div>
              {!isShrunk && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col overflow-hidden"
                >
                  <p className="font-body-md text-sm font-bold text-white truncate uppercase tracking-tight italic">
                    Authenticate
                  </p>
                  <p className="text-[9px] font-black text-[#35a29f] uppercase tracking-widest leading-none">
                    Required for Access
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

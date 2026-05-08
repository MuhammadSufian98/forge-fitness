"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Headset,
  Mail,
  Bell,
  X,
  Calendar,
  User,
  Target,
  Clock,
  ShieldCheck,
  CreditCard,
  Zap,
  UserX,
} from "lucide-react";
import useHomeShellStore from "@/stores/home/useHomeShellStore";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import { notificationApi } from "@/utils/NotificationApi";

export default function DesktopHeader({ isGuest = false }) {
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const isSidebarShrunk = useHomeShellStore((state) => state.isSidebarShrunk);
  const toggleSidebar = useHomeShellStore((state) => state.toggleSidebar);
  const setActiveSection = useHomeShellStore((state) => state.setActiveSection);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const { data: notifsData } = useSWR(
    !isGuest ? "/api/admin/notifications" : null,
    fetcher,
  );
  const notifications = notifsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      const result = await notificationApi.markAsRead(id);
      if (result.success) mutate("/api/admin/notifications");
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleNotifClick = (notif) => {
    setSelectedNotif(notif);
    if (!notif.isRead) handleMarkAsRead(notif._id);
    setIsNotifOpen(false);
  };

  const NotificationList = () => {
    const [viewState, setViewState] = useState("list"); // "list" or "detail"
    const [localSelected, setLocalSelected] = useState(null);

    const handleNotifClick = (notif) => {
      setLocalSelected(notif);
      setViewState("detail");
      if (!notif.isRead) handleMarkAsRead(notif._id);
    };

    const handleBack = () => {
      setViewState("list");
      setLocalSelected(null);
    };

    return (
      <AnimatePresence mode="wait">
        {isNotifOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-[380px] bg-[#071952] rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[100] backdrop-blur-xl"
          >
            <div className="relative overflow-hidden min-h-[500px]">
              {/* VIEW 1: MASTER LIST */}
              <AnimatePresence>
                {viewState === "list" && (
                  <motion.div
                    key="list"
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <div className="space-y-1">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-[#35a29f] italic">
                          System{" "}
                          <span className="text-white not-italic">
                            Intelligence
                          </span>
                        </h3>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                          {notifications.length} Active Records
                        </p>
                      </div>
                      <button
                        onClick={() => setIsNotifOpen(false)}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                      {notifications.length > 0 ? (
                        notifications.map((n, idx) => (
                          <div
                            key={n._id}
                            onClick={() => handleNotifClick(n)}
                            className={`p-5 mb-2 rounded-3xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer relative group flex gap-4 ${!n.isRead ? "bg-[#35a29f]/5" : ""}`}
                          >
                            {!n.isRead && (
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#35a29f] rounded-full shadow-[0_0_15px_#35a29f]" />
                            )}
                            <div
                              className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border border-white/10 ${!n.isRead ? "bg-[#35a29f] text-[#071952]" : "bg-white/5 text-white/40"}`}
                            >
                              {n.type === "Subscription" ? (
                                <CreditCard size={18} />
                              ) : n.type === "Session" ? (
                                <Clock size={18} />
                              ) : (
                                <Zap size={18} />
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-black text-[11px] text-white uppercase italic tracking-tight truncate">
                                {n.title}
                              </p>
                              <p className="text-[10px] text-white/40 line-clamp-1 italic mt-0.5">
                                "{n.message}"
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                          <Bell size={40} className="mb-4" />
                          <p className="font-black text-[10px] uppercase tracking-widest">
                            No New Transmissions
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* VIEW 2: INTELLIGENCE DETAIL */}
              <AnimatePresence>
                {viewState === "detail" && localSelected && (
                  <motion.div
                    key="detail"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="absolute inset-0 bg-[#071952] flex flex-col"
                  >
                    <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/5">
                      <button
                        onClick={handleBack}
                        className="p-2 bg-white/5 rounded-xl text-[#35a29f] hover:bg-[#35a29f] hover:text-[#071952] transition-all"
                      >
                        <ChevronLeft size={18} strokeWidth={3} />
                      </button>
                      <div>
                        <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white">
                          Record <span className="text-[#35a29f]">Detail</span>
                        </h3>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                          Protocol ID:{" "}
                          {localSelected._id.substring(0, 6).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                      <div className="flex items-center gap-5 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                        <div className="w-14 h-14 rounded-2xl bg-[#35a29f] flex items-center justify-center text-[#071952] shadow-[0_0_20px_rgba(53,162,159,0.3)]">
                          <ShieldCheck size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">
                            Status Report
                          </p>
                          <p className="text-xl font-black text-white uppercase italic leading-none">
                            {localSelected.title}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {localSelected.type === "Session" ? (
                          <>
                            <DetailItem
                              icon={<Target size={18} />}
                              label="Session Name"
                              value={
                                localSelected.data?.sessionName ||
                                "Tactical Drill"
                              }
                            />
                            <DetailItem
                              icon={<Calendar size={18} />}
                              label="Timeline"
                              value={`${localSelected.data?.date} | ${localSelected.data?.timeSlot}`}
                            />
                            <DetailItem
                              icon={<User size={18} />}
                              label="Lead Staff"
                              value={
                                localSelected.data?.coachNames?.join(", ") ||
                                "Active Guard"
                              }
                            />
                          </>
                        ) : (
                          <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10 text-center">
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                              Transmission Payload
                            </p>
                            <p className="text-sm font-bold text-white/70 leading-relaxed italic">
                              "{localSelected.message}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 mt-auto">
                      <button
                        onClick={handleBack}
                        className="w-full py-4 bg-white/5 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all border border-white/5"
                      >
                        Return to Archives
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Helper Component for Detail Items
  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
      <div className="text-[#35a29f]">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
          {label}
        </p>
        <p className="text-xs font-bold text-white uppercase tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );

  const ChevronLeft = ({ size, strokeWidth }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection("Contact");
            }}
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
          >
            <Headset />
          </button>
          {!isGuest && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
            >
              New Workout
            </motion.button>
          )}
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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            {isGuest ? "Read Only" : "Upgrade Tier"}
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
                {isGuest
                  ? "Recurring public sessions"
                  : "Manage your weekly training"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            {isGuest ? "Read Only" : "Book Session"}
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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
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
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
            >
              <Bell
                className="text-on-surface-variant group-hover:text-primary transition-colors"
                size={24}
              />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationList />
          </div>
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
                FORGE FITNESS AI{" "}
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

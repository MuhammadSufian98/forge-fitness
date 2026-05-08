"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Users, BarChart3, Search, Bell, X, Calendar, User, Target, Clock } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/userAuth";
import { notificationApi } from "@/utils/NotificationApi";

export default function AdminDesktopHeader({ activeSection, isSidebarShrunk, toggleSidebar }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const { data: notifsData } = useSWR("/api/admin/notifications", fetcher);
  const notifications = notifsData?.data || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
  };

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
    Applications: {
      title: "HR & Applications",
      subtitle: "Leave & administrative",
      icon: <span className="material-symbols-outlined">description</span>,
      button: "New Request",
    },
    "Daily Reports": {
      title: "Operations Intel",
      subtitle: "Daily performance briefs",
      icon: <span className="material-symbols-outlined">assessment</span>,
      button: "New Report",
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

        <div className="flex items-center gap-6 relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors group"
          >
            <Bell className="text-on-surface-variant group-hover:text-primary transition-colors" size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full border-2 border-surface flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-outline-variant/30 overflow-hidden"
              >
                <div className="p-6 bg-primary text-white flex justify-between items-center">
                  <h3 className="font-black text-xs uppercase tracking-widest italic">Notifications</h3>
                  <button onClick={() => setIsNotifOpen(false)}><X size={16} /></button>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotifClick(n)}
                        className={`p-4 border-b border-outline-variant/10 hover:bg-surface-container transition-colors cursor-pointer relative ${!n.isRead ? 'bg-primary/5' : ''}`}
                      >
                        {!n.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-secondary rounded-full" />}
                        <p className="font-bold text-primary text-xs truncate">{n.title}</p>
                        <p className="text-[10px] text-on-surface-variant line-clamp-2 mt-1">{n.message}</p>
                        <p className="text-[8px] text-outline mt-2 font-black uppercase">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center italic text-outline text-xs">No active alerts...</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-bold text-[11px] tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            {current.button}
          </motion.button>
        </div>
      </div>

      {/* Booking Detail Popup */}
      <AnimatePresence>
        {selectedNotif && selectedNotif.type === 'booking' && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotif(null)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Calendar size={24} />
                </div>
                <button onClick={() => setSelectedNotif(null)} className="text-outline hover:text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-black text-primary uppercase italic tracking-tighter">Session Details</h2>
                <p className="text-on-surface-variant text-sm mt-1">Operational brief for upcoming booking.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
                  <User className="text-secondary" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Athlete</p>
                    <p className="font-bold text-primary">{selectedNotif.data?.athleteName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
                  <Target className="text-secondary" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Fitness Goal</p>
                    <p className="font-bold text-primary">{selectedNotif.data?.goal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
                  <Clock className="text-secondary" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-outline uppercase tracking-widest">Time Slot</p>
                    <p className="font-bold text-primary">{selectedNotif.data?.sessionName} | {selectedNotif.data?.timeSlot}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedNotif(null)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary transition-all shadow-xl"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}


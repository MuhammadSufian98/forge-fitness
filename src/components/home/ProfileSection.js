"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/stores/auth/useAuthStore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Dumbbell,
  Target,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  Clock,
  X,
  Loader2,
  BadgeCheck,
  Activity,
  BookOpen,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ProfileSection() {
  const { user, isVerifying, logout, updateUserProfile } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    fitnessGoals: "",
    bio: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        fitnessGoals: user.fitnessGoals || "",
        bio: user.bio || "",
        password: "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const loadingToast = toast.loading("Synchronizing Profile...");
    const result = await updateUserProfile(editForm);
    if (result.success) {
      toast.success("Profile Synchronized Successfully!", { id: loadingToast });
      setIsEditModalOpen(false);
    } else {
      toast.error(result.message || "Synchronization Failure", {
        id: loadingToast,
      });
    }
    setIsUpdating(false);
  };

  if (isVerifying || !user)
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f2f3f6]">
        <Loader2 className="animate-spin text-[#071952]" size={40} />
      </div>
    );

  const initials =
    user.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "??";

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-16 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. IDENTITY CARD */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl border border-[#071952]/5 flex flex-col md:flex-row items-center gap-10"
          >
            <div className="relative shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] bg-[#071952] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl overflow-hidden">
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
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-3 bg-[#35a29f] text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-transform"
              >
                <Settings size={20} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                      {user.fullName}
                    </h2>
                    <User className="text-[#088395]" size={24} />
                  </div>
                  
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 bg-[#071952] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#088395] transition-all flex items-center justify-center gap-2"
                  >
                    <Settings size={14} /> Edit Profile
                  </button>
                </div>
                <p className="text-[#088395] font-bold text-xs uppercase tracking-[0.3em] mt-2">
                  Athlete Member Since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3f6] rounded-xl text-[10px] font-bold text-[#071952]/60 uppercase">
                  <Mail size={14} className="text-[#088395]" /> {user.email}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3f6] rounded-xl text-[10px] font-bold text-[#071952]/60 uppercase">
                  <Phone size={14} className="text-[#088395]" />{" "}
                  {user.phoneNumber || user.phone || "No phone added"}
                </div>
              </div>

              {user.bio && (
                <p className="text-[#071952]/60 text-sm font-medium leading-relaxed italic border-l-4 border-[#35a29f] pl-4">
                  "{user.bio}"
                </p>
              )}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 2. MEMBERSHIP STATUS */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-[#071952] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#088395]/20 rounded-full blur-[100px] -mr-32 -mt-32" />

              <header className="relative z-10 flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-[#35a29f]" size={24} />
                  <h3 className="font-black uppercase tracking-widest text-xs italic">
                    Tier Management
                  </h3>
                </div>
                <span className="px-4 py-1.5 bg-[#35a29f] rounded-full text-[9px] font-black uppercase tracking-widest">
                  {user.status || "Active"}
                </span>
              </header>

              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Current Plan
                  </p>
                  <p className="text-4xl font-black italic uppercase">
                    {user.subscriptionTier || "Basic"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-[#088395]" />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">
                        Biometric Sync
                      </p>
                      <p className="text-sm font-black uppercase text-[#35a29f]">
                        Connected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-[#088395]" />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">
                        Join Date
                      </p>
                      <p className="text-sm font-black uppercase">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 3. FITNESS GOALS */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm space-y-8"
            >
              <h3 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">
                Core Objectives
              </h3>

              <div className="space-y-6">
                <div className="p-5 bg-[#f2f3f6] rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-[#071952]" />
                    <span className="text-[9px] font-black text-[#071952]/40 uppercase tracking-widest">
                      Primary Goal
                    </span>
                  </div>
                  <p className="text-lg font-black text-[#071952] uppercase italic leading-tight">
                    {user.fitnessGoals || "No goal set yet"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-[#071952]/40 uppercase">
                      Performance Metrics
                    </span>
                    <Dumbbell size={14} className="text-[#088395]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-[#071952]/5 p-4 rounded-2xl text-center">
                      <p className="text-xl font-black text-[#071952]">
                        {user.classesCount || 0}
                      </p>
                      <p className="text-[9px] font-bold text-[#071952]/40 uppercase">
                        Classes
                      </p>
                    </div>
                    <div className="bg-white border border-[#071952]/5 p-4 rounded-2xl text-center">
                      <p className="text-xl font-black text-[#071952]">
                        {user.rating || "N/A"}
                      </p>
                      <p className="text-[9px] font-bold text-[#071952]/40 uppercase">
                        Rating
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* 4. ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={logout}
              className="px-10 py-5 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(7,25,82,0.3)] overflow-hidden border border-white"
            >
              <header className="p-10 pb-6 flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#071952] uppercase italic leading-none tracking-tighter">
                    Identity{" "}
                    <span className="text-[#088395] not-italic">Settings</span>
                  </h3>
                  <p className="text-[10px] font-black text-[#071952]/30 uppercase tracking-[0.2em]">
                    Update your athlete profile credentials
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 hover:bg-[#f2f3f6] rounded-2xl transition-colors text-[#071952]/40"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </header>

              <form
                onSubmit={handleUpdateProfile}
                className="p-10 pt-0 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">
                      Full Identity
                    </label>
                    <div className="relative group">
                      <User
                        size={16}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fullName: e.target.value })
                        }
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 pl-12 pr-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] transition-all placeholder:text-[#071952]/20"
                        placeholder="Athlete Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">
                      Secure Contact
                    </label>
                    <div className="relative group">
                      <Phone
                        size={16}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        type="text"
                        value={editForm.phoneNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 pl-12 pr-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] transition-all placeholder:text-[#071952]/20"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Fitness Goals */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">
                      Mission Objective
                    </label>
                    <div className="relative group">
                      <Target
                        size={16}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <select
                        value={editForm.fitnessGoals}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            fitnessGoals: e.target.value,
                          })
                        }
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 pl-12 pr-10 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] transition-all appearance-none"
                      >
                        <option value="">Select Protocol</option>
                        <option value="Weight Loss">Weight Loss</option>
                        <option value="Muscle Gain">Muscle Gain</option>
                        <option value="Endurance">Endurance</option>
                        <option value="Flexibility">Flexibility</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">
                      Update Passkey
                    </label>
                    <div className="relative group">
                      <ShieldCheck
                        size={16}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#088395]"
                      />
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                        className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 pl-12 pr-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] transition-all placeholder:text-[#071952]/20"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio - Full Width */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">
                    Athlete Philosophy
                  </label>
                  <div className="relative group">
                    <BookOpen
                      size={16}
                      className="absolute left-5 top-6 text-[#088395]"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="w-full bg-[#f2f3f6] border-none rounded-3xl py-5 pl-12 pr-6 text-[#071952] font-bold text-sm focus:ring-2 focus:ring-[#35a29f] transition-all min-h-[100px] resize-none"
                      placeholder="Briefly describe your training mindset..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-5 bg-[#f2f3f6] text-[#071952]/40 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#071952]/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-[2] py-5 bg-[#071952] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#088395] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-[#071952]/20"
                  >
                    {isUpdating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Zap size={16} />
                        Synchronize Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" />
    </div>
  );
}

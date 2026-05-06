"use client";
import React from "react";
import { motion } from "framer-motion";
import useProfileStore from "@/stores/home/useProfileStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import { 
  User, Mail, Phone, MapPin, 
  Dumbbell, Target, CreditCard, 
  Settings, LogOut, ShieldCheck, 
  Zap, Clock
} from "lucide-react";

export default function ProfileSection() {
  const userProfile = useProfileStore((state) => state.userProfile);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans">
      <div className="flex-1 overflow-y-auto px-6 py-10 lg:py-16 scroll-smooth custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. IDENTITY CARD (The "User Side") */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl border border-[#071952]/5 flex flex-col md:flex-row items-center gap-10"
          >
            <div className="relative shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] bg-[#071952] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl">
                SH
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-[#35a29f] text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-transform">
                <Settings size={20} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter leading-none">
                  {userProfile.name}
                </h2>
                <p className="text-[#088395] font-bold text-xs uppercase tracking-[0.3em] mt-2">Elite Member Since {userProfile.joinDate}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3f6] rounded-xl text-[10px] font-bold text-[#071952]/60 uppercase">
                  <Mail size={14} className="text-[#088395]" /> {userProfile.email}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f2f3f6] rounded-xl text-[10px] font-bold text-[#071952]/60 uppercase">
                  <Phone size={14} className="text-[#088395]" /> {userProfile.phone}
                </div>
              </div>
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 2. MEMBERSHIP STATUS (The "Gym Owner Side") */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 bg-[#071952] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#088395]/20 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <header className="relative z-10 flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-[#35a29f]" size={24} />
                  <h3 className="font-black uppercase tracking-widest text-xs italic">Tier Management</h3>
                </div>
                <span className="px-4 py-1.5 bg-[#35a29f] rounded-full text-[9px] font-black uppercase tracking-widest">
                  {userProfile.status}
                </span>
              </header>

              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Current Plan</p>
                  <p className="text-4xl font-black italic uppercase">{userProfile.membership}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-[#088395]" />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">Renewal Date</p>
                      <p className="text-sm font-black uppercase">May 12, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap size={18} className="text-[#088395]" />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">Payment Method</p>
                      <p className="text-sm font-black uppercase">Visa **** 9012</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* 3. FITNESS GOALS (Lead Capture Data) */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] p-10 border border-[#071952]/5 shadow-sm space-y-8"
            >
              <h3 className="text-[10px] font-black text-[#088395] uppercase tracking-[0.3em] mb-4">Core Objectives</h3>
              
              <div className="space-y-6">
                <div className="p-5 bg-[#f2f3f6] rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-[#071952]" />
                    <span className="text-[9px] font-black text-[#071952]/40 uppercase tracking-widest">Primary Goal</span>
                  </div>
                  <p className="text-lg font-black text-[#071952] uppercase italic leading-tight">{userProfile.goal}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-[#071952]/40 uppercase">Body Composition</span>
                    <Dumbbell size={14} className="text-[#088395]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-[#071952]/5 p-4 rounded-2xl text-center">
                      <p className="text-xl font-black text-[#071952]">{userProfile.metrics.weight}</p>
                      <p className="text-[9px] font-bold text-[#071952]/40 uppercase">Weight</p>
                    </div>
                    <div className="bg-white border border-[#071952]/5 p-4 rounded-2xl text-center">
                      <p className="text-xl font-black text-[#071952]">{userProfile.metrics.bf}</p>
                      <p className="text-[9px] font-bold text-[#071952]/40 uppercase">Body Fat</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

          </div>

          {/* 4. DANGER ZONE / ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex-1 py-5 bg-white border border-[#071952]/5 rounded-2xl text-[#071952] font-black uppercase text-[10px] tracking-widest hover:bg-[#071952] hover:text-white transition-all shadow-sm">
              Manage Biometric Data
            </button>
            <button 
              onClick={logout}
              className="px-10 py-5 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

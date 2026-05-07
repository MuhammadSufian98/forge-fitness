"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  BadgeCheck,
  Zap,
  Camera,
  Save,
  Activity,
  Award,
  Globe,
  LogOut,
  X,
  Loader2,
  Phone,
  MessageSquare,
  ClipboardList
} from "lucide-react";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function AccountProfileSection() {
  const { user, isVerifying, logout, updateUserProfile } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    coachingPhilosophy: "",
    adminNotes: "",
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || user.phone || "",
        bio: user.bio || "",
        coachingPhilosophy: user.coachingPhilosophy || "",
        adminNotes: user.adminNotes || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const result = await updateUserProfile(editForm);
    if (result.success) {
      setIsEditModalOpen(false);
    } else {
      alert(result.message || "Failed to update profile");
    }
    setIsUpdating(false);
  };

  if (isVerifying || !user) return (
    <div className="flex-1 flex items-center justify-center bg-[#f2f3f6]">
      <Loader2 className="animate-spin text-[#071952]" size={40} />
    </div>
  );

  const initials = user.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "??";
  const isAdmin = user.role === "admin";
  const isCoach = user.role === "coach";

  const adminMetrics = [
    { label: "Active Hubs", value: user.hubAccess?.length || 8, icon: <Globe size={18} /> },
    { label: "System Uptime", value: "99.98%", icon: <Activity size={18} /> },
    { label: "Clearance Level", value: `LEVEL ${user.clearanceLevel || 10}`, icon: <ShieldCheck size={18} /> },
  ];

  const coachMetrics = [
    { label: "Accreditations", value: user.accreditations?.length || 4, icon: <Award size={18} /> },
    { label: "Performance Rating", value: `${user.rating || 4.9}/5.0`, icon: <Zap size={18} /> },
    { label: "Retention Rate", value: `${user.retentionRate || 94}%`, icon: <Activity size={18} /> },
  ];

  const metrics = isAdmin ? adminMetrics : coachMetrics;
  const roleIcon = isAdmin ? <ShieldCheck className="text-[#35a29f]" size={28} /> : <BadgeCheck className="text-[#35a29f]" size={28} />;
  const roleLabel = isAdmin ? "System Administrator" : "Elite Performance Coach";
  const themeColor = isAdmin ? "text-[#071952]" : "text-[#088395]";

  return (
    <div className="flex-1 bg-[#f2f3f6] overflow-hidden flex flex-col h-full relative font-sans antialiased">
      <div className="flex-1 overflow-y-auto px-8 py-10 pb-32 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* IDENTITY HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className={`w-24 h-24 rounded-[2rem] ${isAdmin ? 'bg-[#071952]' : 'bg-[#088395]'} text-white flex items-center justify-center text-3xl font-black italic shadow-2xl overflow-hidden transition-transform group-hover:scale-95`}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute -bottom-1 -right-1 p-2 bg-white rounded-xl shadow-lg text-[#071952] hover:text-[#088395] transition-colors border border-[#f2f3f6]"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-[#071952] uppercase italic tracking-tighter">
                    {user.fullName} <span className={themeColor}>Profile</span>
                  </h1>
                  {roleIcon}
                </div>
                <p className="text-[#071952]/30 text-[10px] font-black uppercase tracking-[0.4em] mt-1">
                  {roleLabel} • ID: #{user._id?.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </header>

          {/* METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 border border-[#071952]/5 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#088395]">{metric.icon}</span>
                  <span className="text-[9px] font-black text-[#071952]/30 uppercase tracking-widest">{metric.label}</span>
                </div>
                <p className="text-2xl font-black text-[#071952] italic">{metric.value}</p>
              </motion.div>
            ))}
          </div>

          {/* MAIN CONTENT BENTO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BIO/PHILOSOPHY SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2.5rem] p-10 border border-[#071952]/5 shadow-sm space-y-6"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="text-[#088395]" size={20} />
                <span className="text-[10px] font-black text-[#071952]/30 uppercase tracking-widest">{isCoach ? "Coaching Philosophy" : "Administrative Notes"}</span>
              </div>
              <p className="text-base font-bold text-[#071952] leading-relaxed italic">
                {isCoach ? (user.coachingPhilosophy || "No philosophy statement added.") : (user.adminNotes || "No administrative notes recorded.")}
              </p>
              
              {isCoach && user.accreditations?.length > 0 && (
                <div className="pt-6 border-t border-[#f2f3f6]">
                  <span className="text-[9px] font-black text-[#071952]/30 uppercase tracking-widest block mb-4">Accreditations</span>
                  <div className="flex flex-wrap gap-2">
                    {user.accreditations.map((acc, i) => (
                      <span key={i} className="px-4 py-2 bg-[#f2f3f6] rounded-full text-[10px] font-black text-[#071952] uppercase tracking-wider">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* CONTACT & SECURITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#071952] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#088395]/20 rounded-full blur-[100px] -mr-32 -mt-32" />
              
              <div className="relative z-10 space-y-8">
                <header className="flex items-center gap-3">
                  <ClipboardList className="text-[#35a29f]" size={20} />
                  <h3 className="font-black uppercase tracking-widest text-[10px] italic">System Clearance & Security</h3>
                </header>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Mail className="text-[#35a29f]" size={20} />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">Linked Identity</p>
                      <p className="text-sm font-black">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Phone className="text-[#35a29f]" size={20} />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">Secure Line</p>
                      <p className="text-sm font-black">{user.phoneNumber || user.phone || "UNLINKED"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <Lock className="text-[#35a29f]" size={20} />
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase">Encryption</p>
                      <p className="text-sm font-black uppercase tracking-tighter">AES-256 ACTIVE</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* LOGOUT SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button 
              onClick={logout}
              className="flex-1 py-5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <LogOut size={16} /> Sign Out Terminal
            </button>
          </motion.div>

        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-[#071952]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <header className="p-10 border-b border-[#f2f3f6] flex justify-between items-center">
                <h3 className="text-3xl font-black text-[#071952] uppercase italic tracking-tighter">Terminal <span className="text-[#088395]">Configuration</span></h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-[#f2f3f6] rounded-2xl transition-colors">
                  <X size={28} />
                </button>
              </header>

              <form onSubmit={handleUpdateProfile} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Identity Name</label>
                    <input 
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                      className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Secure Phone</label>
                    <input 
                      type="text"
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                      className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                {isCoach && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Coaching Philosophy</label>
                    <textarea 
                      value={editForm.coachingPhilosophy}
                      onChange={(e) => setEditForm({...editForm, coachingPhilosophy: e.target.value})}
                      className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all min-h-[120px] resize-none"
                      placeholder="Your approach to fitness and performance..."
                    />
                  </div>
                )}

                {isAdmin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Administrative Notes</label>
                    <textarea 
                      value={editForm.adminNotes}
                      onChange={(e) => setEditForm({...editForm, adminNotes: e.target.value})}
                      className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all min-h-[120px] resize-none"
                      placeholder="Internal system notes..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Public Bio</label>
                  <textarea 
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all min-h-[80px] resize-none"
                    placeholder="Short professional biography..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#071952]/40 uppercase tracking-widest ml-1">Update Security Key (Password)</label>
                  <input 
                    type="password"
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="w-full bg-[#f2f3f6] border-none rounded-2xl py-4 px-6 text-[#071952] font-bold outline-none focus:ring-2 focus:ring-[#35a29f] transition-all"
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-6 bg-[#071952] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-[#088395] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={20} /> : "Finalize Configuration"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

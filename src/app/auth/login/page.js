"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import useAuthStore from "@/stores/auth/useAuthStore";
import {
  Mail,
  Lock,
  ArrowRight,
  Dumbbell,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const setLoginField = useAuthStore((state) => state.setLoginField);
  const loginSubmit = useAuthStore((state) => state.loginSubmit);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginSubmit();
    if (result.success) {
      if (result.data.role === "admin" || result.data.role === "coach") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <div className="h-screen w-full bg-[#f2f3f6] flex items-center justify-center p-4 md:p-6 font-sans antialiased overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#088395]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#071952]/10 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-6xl h-full max-h-[600px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-row border border-white">
        {/* LEFT SIDE: Branding - Balanced for width */}
        <section className="relative hidden md:flex md:w-1/2 overflow-hidden bg-[#071952] p-8 lg:p-12 flex-col justify-between">
          <img
            alt="Gym Atmosphere"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071952] via-[#071952]/80 to-transparent"></div>

          <div className="relative z-10">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group mb-4"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                Back to site
              </span>
            </Link>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35a29f]/20 border border-[#35a29f]/30 mb-4">
                <Sparkles size={12} className="text-[#35a29f]" />
                <span className="text-[#35a29f] text-[8px] font-black uppercase tracking-[0.2em]">
                  PeakForm Ecosystem
                </span>
              </div>
              <h1 className="text-white font-black text-4xl lg:text-5xl uppercase italic leading-[0.9] tracking-tighter mb-4">
                FORGE <br /> YOUR{" "}
                <span className="text-[#088395] not-italic text-5xl lg:text-7xl">
                  ELITE
                </span>{" "}
                <br /> SELF
              </h1>
              <p className="text-white/50 font-medium text-xs leading-relaxed max-w-[280px]">
                Access personalized biometrics and performance tracking.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#071952] bg-[#f2f3f6] flex items-center justify-center text-[8px] font-bold text-[#071952] uppercase"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">
              12k+ Athletes
            </p>
          </div>
        </section>

        {/* RIGHT SIDE: Form - Redesigned for absolute vertical centering and no scroll */}
        <section className="flex-1 bg-white flex flex-col items-center justify-center p-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[320px] lg:max-w-[360px] space-y-6"
          >
            <header className="text-center md:text-left space-y-1">
              <h2 className="text-3xl font-black text-[#071952] uppercase tracking-tighter italic leading-none">
                Sign <span className="text-[#088395] not-italic">In</span>
              </h2>
              <p className="text-[#071952]/40 text-[9px] font-black uppercase tracking-[0.2em]">
                Authorized Access Only
              </p>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#071952]/30 uppercase tracking-[0.2em] ml-1">
                  Email Identity
                </label>
                <div className="relative group">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#071952]/20 group-focus-within:text-[#088395] transition-colors"
                  />
                  <input
                    type="email"
                    value={login.email}
                    onChange={(e) => setLoginField("email", e.target.value)}
                    placeholder="athlete@peakform.com"
                    className="w-full bg-[#f2f3f6] border-none rounded-xl py-3.5 pl-12 pr-4 text-[#071952] font-bold text-xs focus:ring-1 focus:ring-[#35a29f] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-[#071952]/30 uppercase tracking-[0.2em]">
                    Passkey
                  </label>
                  <button className="text-[8px] font-black text-[#088395] uppercase hover:underline">
                    Reset?
                  </button>
                </div>
                <div className="relative group">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#071952]/20 group-focus-within:text-[#088395] transition-colors"
                  />
                  <input
                    type="password"
                    value={login.password}
                    onChange={(e) => setLoginField("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f2f3f6] border-none rounded-xl py-3.5 pl-12 pr-4 text-[#071952] font-bold text-xs focus:ring-1 focus:ring-[#35a29f] transition-all outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[9px] font-bold">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#071952] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#088395] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  {isLoading ? "Authorizing..." : "SIGN IN"}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>

            <footer className="pt-6 border-t border-[#f2f3f6] text-center space-y-3">
              <p className="text-[#071952]/30 text-[9px] font-black uppercase tracking-widest leading-none">
                New Recruit?
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-[#f2f3f6] px-6 py-3 rounded-lg text-[#071952] font-black text-[9px] uppercase tracking-[0.2em] hover:bg-[#071952] hover:text-white transition-all group"
              >
                Join the Elite
                <Dumbbell
                  size={14}
                  className="group-hover:rotate-12 transition-transform"
                />
              </Link>
            </footer>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

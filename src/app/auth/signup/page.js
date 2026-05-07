"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function SignupPage() {
  const signup = useAuthStore((state) => state.signup);
  const setSignupField = useAuthStore((state) => state.setSignupField);
  const signupSubmit = useAuthStore((state) => state.signupSubmit);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signupSubmit();
    if (result.success) {
      alert("Account created! Please login.");
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen selection:bg-secondary-container antialiased">
      <main className="min-h-screen flex">
        {/* Left Column: Hero Brand Image */}
        <section className="hidden lg:flex w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuACMAgRyralQCVpxDUBdkD6MuOz3lYiJph9P3D5lCPsLuZnNESv1EEidzKvw-HGufbKpF3mT2lQZdomTxrFyWncFtiylTefaEMZhWADpUNtfzdVFkzQpjsJUSNG6Or9SkRqb5NBDlGfM2b3KaYmeiYd-5_jOLoCcYvR05UXf-ghbElN2FXSQW-dvPTrVmIpUiiqwzRroWVWjtGo5qKi-GwRNukOoaPLm0JoUsAV5g6CLoIN0H1Bmy9Rpins1IT2ZD5u5GLmZp_HHtQ" 
              alt="Gym Atmosphere"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-bottom from-primary/20 to-primary/85 flex flex-col justify-end p-xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-md"
            >
              <div className="mb-md">
                <span className="font-h1 text-h1 font-black tracking-tighter text-white">VITALITY</span>
              </div>
              <h2 className="font-h1 text-[56px] leading-[1.1] text-white mb-lg">
                Forge Your Best Self
              </h2>
              <p className="text-white/80 font-body-lg max-w-sm">
                Experience the next level of precision fitness training with data-driven insights and professional-grade coaching.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Right Column: Signup Form */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-md lg:p-xl bg-[#f2f3f6]">
          <div className="w-full max-w-[480px] space-y-lg">
            {/* Logo for mobile visibility */}
            <div className="lg:hidden flex justify-center mb-xl">
              <span className="font-h1 text-h1 font-black tracking-tighter text-primary">VITALITY</span>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-[2rem] p-xl bg-white/85 backdrop-blur-[20px] border border-white/30 shadow-xl"
            >
              <header className="mb-xl text-center">
                <h1 className="font-h2 text-h2 text-primary mb-xs">Join the Elite</h1>
                <p className="text-on-surface-variant font-body-md">Start your journey to peak performance today.</p>
              </header>

              <form className="space-y-md" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant ml-xs uppercase">FULL NAME</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">person</span>
                    <input 
                      className="w-full pl-[48px] pr-md py-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none placeholder:text-outline-variant text-body-md" 
                      placeholder="Enter your full name" 
                      type="text"
                      value={signup.fullName}
                      onChange={(e) => setSignupField("fullName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant ml-xs uppercase">EMAIL ADDRESS</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">mail</span>
                    <input 
                      className="w-full pl-[48px] pr-md py-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none placeholder:text-outline-variant text-body-md" 
                      placeholder="name@example.com" 
                      type="email"
                      value={signup.email}
                      onChange={(e) => setSignupField("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant ml-xs uppercase">PASSWORD</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">lock</span>
                    <input 
                      className="w-full pl-[48px] pr-md py-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none placeholder:text-outline-variant text-body-md" 
                      placeholder="••••••••" 
                      type="password"
                      value={signup.password}
                      onChange={(e) => setSignupField("password", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Fitness Goal */}
                <div className="space-y-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant ml-xs uppercase">FITNESS GOAL</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors">ads_click</span>
                    <select 
                      className="w-full pl-[48px] pr-md py-md bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none cursor-pointer text-body-md"
                      value={signup.goal}
                      onChange={(e) => setSignupField("goal", e.target.value)}
                      required
                    >
                      <option disabled value="">Select your primary goal</option>
                      <option>Build Strength & Muscle</option>
                      <option>Weight Loss & Tone</option>
                      <option>Endurance & Cardio</option>
                      <option>Flexibility & Recovery</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                  </div>
                </div>

                {error && (
                  <div className="p-md bg-red-50 border border-red-200 rounded-lg text-red-700 text-body-sm font-bold">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-md">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-md bg-primary-container text-white font-h3 rounded-full hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-sm uppercase tracking-widest"
                  >
                    {isLoading ? "PROVISIONING..." : "JOIN THE ELITE"}
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </form>

              {/* Footer Link */}
              <footer className="mt-xl text-center">
                <p className="text-on-surface-variant font-body-md">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-secondary font-bold hover:underline transition-all">
                    Login
                  </Link>
                </p>
              </footer>
            </motion.div>

            {/* Subtle Trust Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              className="flex justify-center items-center gap-md"
            >
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtpu2v68blaWn9V71BBcn_uQaiqi5OCABFm7bvE-YE8eN57h2nf5lB1zBNS_sujAhWo4EBB-wxxZVETbqQP8jk9AiDf4oUybbezVd3RuIyxouOAVl0R97sa9rKEFa4qRXiSffNVsjlOE3w2uVW41hh5DVo5tRt57072ljE_UCmr9PSEmPGcSmHbxYdVOnZIVyJUrfpG3Z4-UekSsqpV8lL41fE6DzIRebCWRGc3hezwHHHu-wpO5xwQ6RzFRHsu_AP2rf3STqPtEw" alt="User" />
                <img className="w-8 h-8 rounded-full ring-2 ring-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgdh_kvXAqT8BcR__ubdKDjVnPTX2rR7Nf6GIsZUlUALP-e70eYnELbajY-2qXbBPIlZt97lfxehtpYZ2T7-80FvZOrjRU1oOpzhACYo7w4cGBNiv4juWE4BNL-pwRfZKrYgKnTC834SHqtvM37AGIv0mw1GW8vfbAEb6wsH37m9KYdXLSRmhSE_JYT6p6vX2x70QpB03lq53p37Pqsy4x4Fy75Wo4Ta-iAFkqHCarckB9ft11h7BksG2yiT6ofBM4QRb8mJft_5Y" alt="User" />
              </div>
              <span className="text-label-caps text-on-surface-variant uppercase">Join 50,000+ Athletes</span>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:flex flex-col md:flex-row justify-between items-center w-full px-container-padding py-lg gap-md bg-background/80 backdrop-blur-xl border-t border-white/10 fixed bottom-0">
        <span className="font-body-md text-body-md text-on-surface-variant">© 2024 Vitality Fitness. All rights reserved.</span>
        <div className="flex gap-lg">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

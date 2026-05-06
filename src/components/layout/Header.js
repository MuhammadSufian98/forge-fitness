"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 lg:hidden bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm flex justify-between items-center px-container-padding h-16"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcMq0qnSZOSiLTSamF03A57LRMsQVOZSNUvSQQ2iFB9wqkmX4kLIvyKBMYGLJG8AmhGL3WDxYVn0GQHRFNFa4CGjcmyfydMF8cF3MKGeuP1GqBWx7vom0mjJKjeICDm1u6qlmlPBCzgZDTvapkD8RESoHqfID-fvShyB_Fc2Tw9L2ejNgNOvOe8j3nsPpZYn9GZPcntljjkvIB1c2AiVnrCPurWFvvp25AVtrg7oVENeLyPFQsON008UvlDNbjWMDrdcLczveCIrA" 
          alt="User Profile" 
        />
      </div>
      <h1 className="font-h2 text-h2 tracking-tighter text-primary dark:text-primary-fixed">FORGE FITNESS</h1>
      <button className="active:scale-95 transition-transform hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim">notifications</span>
      </button>
    </motion.header>
  );
}

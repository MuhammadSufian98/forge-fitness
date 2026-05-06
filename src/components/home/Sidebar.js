"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ activeSection, setActiveSection, isShrunk }) {
  const menuItems = [
    { icon: "home", label: "Home" },
    { icon: "fitness_center", label: "Plans" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "groups", label: "Trainers" },
    { icon: "smart_toy", label: "AI Coach", fill: true },
    { icon: "card_membership", label: "Trial" },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{
        width: isShrunk ? 80 : 256,
        paddingLeft: isShrunk ? 16 : 24,
        paddingRight: isShrunk ? 16 : 24,
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-screen hidden lg:flex flex-col bg-surface/80 backdrop-blur-3xl border-r border-primary/5 shadow-2xl py-6 gap-4 z-50 overflow-hidden"
    >
      <div
        className={`flex flex-col gap-1 mb-6 ${isShrunk ? "items-center" : ""}`}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20 cursor-pointer shrink-0"
        >
          <span
            className="material-symbols-outlined text-white text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            fitness_center
          </span>
        </motion.div>
        {!isShrunk && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col"
          >
            <span className="text-xl font-black text-primary tracking-tighter whitespace-nowrap">
              FORGE FITNESS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 whitespace-nowrap">
              Elite Performance
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.label;
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
              className={`flex items-center transition-all rounded-2xl group relative overflow-hidden h-12 ${
                isShrunk ? "justify-center w-12" : "gap-4 p-3.5"
              } ${
                isActive
                  ? "text-primary font-bold bg-primary/5"
                  : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={`absolute left-0 bg-primary rounded-full ${isShrunk ? "top-1 bottom-1 w-1.5" : "top-2 bottom-2 w-1"}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                  isActive
                    ? "text-primary"
                    : "text-on-surface-variant/70 group-hover:text-primary"
                }`}
                style={
                  item.fill || isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : {}
                }
              >
                {item.icon}
              </span>
              {!isShrunk && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[14px] tracking-tight whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.a>
          );
        })}
      </div>

      <div
        onClick={() => setActiveSection("Profile")}
        className={`mt-auto pt-6 border-t border-primary/5 flex items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-2xl p-2 ${isShrunk ? "justify-center" : "gap-3"}`}
      >
        <div className="relative shrink-0">
          <img
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsh2Ltg36aujsb2e2OaTW7Z5uu-pdmf2z7ZfyAzNcTd2pRaS7XDVYqhlLmjqMDaTu7c9mpIbkPtH29wCUZ7we3E_sWhIRTuWeGhTR-2pTm5J9xy7fOA7IlGx_KTIpzkMwlONPY3NhfYdxIt1FnhF8yMyhF0vyo05e9znHXs-TzCPVwYw-bIFwWIpmrakbDI9c4GUMoOk5Z3Vqs3_FtzuL-M1NKca6-tXNo_p6txG0FgF8_u6zYyconfJPFRfppDbdIidMSztiUv00"
            alt="Sufian Hassan"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
        </div>
        {!isShrunk && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="font-bold text-[13px] text-primary whitespace-nowrap">
              Sufian Hassan
            </span>
            <span className="text-[11px] text-on-surface-variant/70 font-medium whitespace-nowrap">
              Pro Member
            </span>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

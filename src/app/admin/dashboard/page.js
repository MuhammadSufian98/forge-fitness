"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDesktopHeader from "@/components/admin/AdminDesktopHeader";
import AdminDashboardSection from "@/components/admin/AdminDashboardSection";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import useAuthStore from "@/stores/auth/useAuthStore";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false);
  const { user, isVerifying } = useAuthStore();

  const toggleSidebar = () => setIsSidebarShrunk(!isSidebarShrunk);

  if (isVerifying) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-surface">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-primary mx-auto" size={48} />
          <p className="font-label-caps text-label-caps text-on-surface-variant animate-pulse tracking-[0.3em]">
            VERIFYING SYSTEM CLEARANCE
          </p>
        </div>
      </div>
    );
  }

  // If not admin or coach, the middleware should have redirected, but as a fallback:
  if (!user || (user.role !== 'admin' && user.role !== 'coach')) {
    return null; 
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface selection:bg-primary/10">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isShrunk={isSidebarShrunk}
      />

      <AdminHeader />

      <main
        className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarShrunk ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <AdminDesktopHeader
          activeSection={activeSection}
          isSidebarShrunk={isSidebarShrunk}
          toggleSidebar={toggleSidebar}
        />
        <AdminDashboardSection activeSection={activeSection} />
      </main>

      <AdminMobileNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-lg right-lg w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center transition-all z-[70] group"
      >
        <span
          className="material-symbols-outlined group-hover:rotate-12 transition-transform"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          bolt
        </span>
      </motion.button>
    </div>
  );
}

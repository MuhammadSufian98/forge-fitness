"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDesktopHeader from "@/components/admin/AdminDesktopHeader";
import AdminDashboardSection from "@/components/admin/AdminDashboardSection";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false);

  const toggleSidebar = () => setIsSidebarShrunk(!isSidebarShrunk);

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
    </div>
  );
}

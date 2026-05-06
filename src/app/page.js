"use client";

import { useState } from "react";
import Sidebar from "@/components/home/Sidebar";
import Header from "@/components/layout/Header";
import DesktopHeader from "@/components/layout/DesktopHeader";
import ChatSection from "@/components/home/ChatSection";
import HomeSection from "@/components/home/HomeSection";
import PlansSection from "@/components/home/PlansSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import TrainersSection from "@/components/home/TrainersSection";
import TrialSection from "@/components/home/TrialSection";
import ProfileSection from "@/components/home/ProfileSection";
import ContactSection from "@/components/home/ContactUsSection";
import MobileNav from "@/components/layout/MobileNav";

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false);

  const toggleSidebar = () => setIsSidebarShrunk(!isSidebarShrunk);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface selection:bg-primary/10">
      {/* Desktop Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isShrunk={isSidebarShrunk}
        setIsShrunk={setIsSidebarShrunk}
      />

      {/* Mobile Top Header */}
      <Header />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarShrunk ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <DesktopHeader
          activeSection={activeSection}
          isSidebarShrunk={isSidebarShrunk}
          toggleSidebar={toggleSidebar}
          setActiveSection={setActiveSection}
        />
        {activeSection === "Home" ? (
          <HomeSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Plans" ? (
          <PlansSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Schedule" ? (
          <ScheduleSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Trainers" ? (
          <TrainersSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Trial" ? (
          <TrialSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Profile" ? (
          <ProfileSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : activeSection === "Contact" ? (
          <ContactSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <ChatSection
            isSidebarShrunk={isSidebarShrunk}
            toggleSidebar={toggleSidebar}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}

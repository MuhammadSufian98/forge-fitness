"use client";

import { useEffect } from "react";
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
import useHomeShellStore from "@/stores/home/useHomeShellStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import { Loader2 } from "lucide-react";

const guestSections = ["Home", "Plans", "Schedule", "Trial"];

export default function Home() {
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const setActiveSection = useHomeShellStore((state) => state.setActiveSection);
  const isSidebarShrunk = useHomeShellStore((state) => state.isSidebarShrunk);
  const { isVerifying, user } = useAuthStore();
  const isGuest = !user;

  useEffect(() => {
    if (isGuest && !guestSections.includes(activeSection)) {
      setActiveSection("Home");
    }
  }, [activeSection, isGuest, setActiveSection]);

  if (isVerifying) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f2f3f6]">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-[#071952] mx-auto" size={48} />
          <p className="font-black text-[#071952] animate-pulse tracking-[0.3em] uppercase italic">
            Synchronizing Athlete Bio-Link
          </p>
        </div>
      </div>
    );
  }

  if (user && user.role !== 'athlete') {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface selection:bg-primary/10">
      <Sidebar isGuest={isGuest} />
      <Header />

      <main
        className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarShrunk ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <DesktopHeader isGuest={isGuest} />
        {activeSection === "Home" ? (
          <HomeSection user={user} isGuest={isGuest} />
        ) : activeSection === "Plans" ? (
          <PlansSection isReadOnly={isGuest} />
        ) : activeSection === "Schedule" ? (
          <ScheduleSection isReadOnly={isGuest} />
        ) : !isGuest && activeSection === "Trainers" ? (
          <TrainersSection />
        ) : activeSection === "Trial" ? (
          <TrialSection />
        ) : !isGuest && activeSection === "Profile" ? (
          <ProfileSection />
        ) : activeSection === "Contact" ? (
          <ContactSection />
        ) : !isGuest ? (
          <ChatSection />
        ) : (
          <HomeSection user={user} isGuest={isGuest} />
        )}
      </main>

      <MobileNav isGuest={isGuest} />
    </div>
  );
}

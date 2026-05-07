"use client";

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

export default function Home() {
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const isSidebarShrunk = useHomeShellStore((state) => state.isSidebarShrunk);
  const { isVerifying, user } = useAuthStore();

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

  if (!user || user.role !== 'athlete') {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface selection:bg-primary/10">
      <Sidebar />
      <Header />

      <main
        className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarShrunk ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <DesktopHeader />
        {activeSection === "Home" ? (
          <HomeSection user={user} />
        ) : activeSection === "Plans" ? (
          <PlansSection />
        ) : activeSection === "Schedule" ? (
          <ScheduleSection />
        ) : activeSection === "Trainers" ? (
          <TrainersSection />
        ) : activeSection === "Trial" ? (
          <TrialSection />
        ) : activeSection === "Profile" ? (
          <ProfileSection />
        ) : activeSection === "Contact" ? (
          <ContactSection />
        ) : (
          <ChatSection />
        )}
      </main>

      <MobileNav />
    </div>
  );
}

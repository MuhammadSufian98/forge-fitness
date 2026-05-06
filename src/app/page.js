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

export default function Home() {
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const isSidebarShrunk = useHomeShellStore((state) => state.isSidebarShrunk);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface selection:bg-primary/10">
      <Sidebar />
      <Header />

      <main
        className={`flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1] ${isSidebarShrunk ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <DesktopHeader />
        {activeSection === "Home" ? (
          <HomeSection />
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

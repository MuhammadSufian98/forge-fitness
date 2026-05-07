"use client";

import useHomeShellStore from "@/stores/home/useHomeShellStore";

export default function MobileNav({ isGuest = false }) {
  const activeSection = useHomeShellStore((state) => state.activeSection);
  const setActiveSection = useHomeShellStore((state) => state.setActiveSection);
  const navItems = [
    { icon: "home", label: "Home" },
    { icon: "fitness_center", label: "Plans" },
    { icon: "calendar_month", label: "Schedule" },
    { icon: "workspace_premium", label: "Trial" },
    ...(!isGuest
      ? [
          { icon: "person", label: "Trainers" },
          { icon: "mail", label: "Contact" },
        ]
      : []),
  ];

  return (
    <nav className="fixed bottom-0 w-full lg:hidden z-50 rounded-t-xl bg-surface/70 dark:bg-primary-container/70 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center w-full px-xs pb-safe pt-sm max-w-md mx-auto h-20">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.label;
          return (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.label);
              }}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 ${
                isActive 
                  ? "text-secondary dark:text-secondary-container scale-110" 
                  : "text-on-surface-variant/60 dark:text-outline-variant hover:text-secondary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

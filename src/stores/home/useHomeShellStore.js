import { create } from "zustand";

const useHomeShellStore = create((set) => ({
  activeSection: "Home",
  isSidebarShrunk: false,
  setActiveSection: (activeSection) => set({ activeSection }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarShrunk: !state.isSidebarShrunk })),
  setIsSidebarShrunk: (isSidebarShrunk) => set({ isSidebarShrunk }),
}));

export default useHomeShellStore;

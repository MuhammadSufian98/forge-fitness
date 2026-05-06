import { create } from "zustand";

const useAdminShellStore = create((set) => ({
  activeSection: "Dashboard",
  isSidebarShrunk: false,
  setActiveSection: (activeSection) => set({ activeSection }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarShrunk: !state.isSidebarShrunk })),
  setIsSidebarShrunk: (isSidebarShrunk) => set({ isSidebarShrunk }),
}));

export default useAdminShellStore;

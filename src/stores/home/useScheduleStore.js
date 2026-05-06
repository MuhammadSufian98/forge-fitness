import { create } from "zustand";

const useScheduleStore = create((set) => ({
  selectedClass: null,
  activeDate: 12,
  openClass: (selectedClass) => set({ selectedClass }),
  closeClass: () => set({ selectedClass: null }),
  setActiveDate: (activeDate) => set({ activeDate }),
}));

export default useScheduleStore;

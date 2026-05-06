import { create } from "zustand";

const usePlansStore = create((set) => ({
  selectedPlan: null,
  openPlan: (selectedPlan) => set({ selectedPlan }),
  closePlan: () => set({ selectedPlan: null }),
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
}));

export default usePlansStore;

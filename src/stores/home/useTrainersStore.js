import { create } from "zustand";

const useTrainersStore = create((set) => ({
  selectedTrainer: null,
  activeFilter: "All",
  rating: 0,
  openTrainer: (selectedTrainer) => set({ selectedTrainer }),
  closeTrainer: () => set({ selectedTrainer: null }),
  setActiveFilter: (activeFilter) => set({ activeFilter }),
  setRating: (rating) => set({ rating }),
}));

export default useTrainersStore;

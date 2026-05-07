import { create } from "zustand";
import { trainersApi } from "@/utils/authApi";

export const SPECIALIZATION_OPTIONS = [
  "Strength",
  "Yoga",
  "HIIT",
  "CrossFit",
  "Pilates",
  "Mobility",
  "Cardio",
  "Rehab",
];

const useTrainersStore = create((set, get) => ({
  trainers: [],
  isLoading: false,
  error: null,
  isAddOpen: false,
  selectedTrainer: null,
  newTrainer: {
    name: "",
    email: "",
    password: "",
    specialization: SPECIALIZATION_OPTIONS[0],
  },

  setIsAddOpen: (isAddOpen) => set({ isAddOpen }),
  setSelectedTrainer: (selectedTrainer) => set({ selectedTrainer }),
  setNewTrainer: (newTrainer) => set({ newTrainer }),

  updateNewTrainer: (name, value) =>
    set((state) => ({
      newTrainer: { ...state.newTrainer, [name]: value },
    })),

  fetchTrainers: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await trainersApi.getAll();
      if (data.success) {
        set({ trainers: data.data, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      set({ error: "Failed to fetch trainers", isLoading: false });
    }
  },

  addTrainer: async () => {
    const { name, email, password, specialization } = get().newTrainer;
    if (!name || !email || !password) return { success: false, message: "Missing fields" };

    set({ isLoading: true, error: null });
    try {
      const data = await trainersApi.add({
        name,
        email,
        password,
        accreditation: specialization
      });
      if (data.success) {
        await get().fetchTrainers();
        set({
          newTrainer: {
            name: "",
            email: "",
            password: "",
            specialization: SPECIALIZATION_OPTIONS[0],
          },
          isAddOpen: false,
          isLoading: false
        });
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to add trainer", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },

  updateTrainerStatus: async (trainerId, status) => {
    set({ isLoading: true, error: null });
    try {
      const data = await trainersApi.update(trainerId, { status });
      if (data.success) {
        set((state) => ({
          trainers: state.trainers.map(t => t._id === trainerId ? { ...t, status } : t),
          isLoading: false,
          selectedTrainer: state.selectedTrainer?._id === trainerId ? { ...state.selectedTrainer, status } : state.selectedTrainer
        }));
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to update trainer", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },

  offboardTrainer: async (trainerId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await trainersApi.delete(trainerId);
      if (data.success) {
        set((state) => ({
          trainers: state.trainers.filter(t => t._id !== trainerId),
          isLoading: false,
          selectedTrainer: null
        }));
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to offboard trainer", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },
}));

export default useTrainersStore;

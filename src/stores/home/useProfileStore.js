import { create } from "zustand";

const useProfileStore = create((set) => ({
  userProfile: {
    name: "Sufian Hassan",
    email: "sufianhassan98@gmail.com",
    phone: "+92 300 0000000",
    membership: "Pro Performance",
    status: "Active",
    joinDate: "Jan 2026",
    goal: "Muscle Hypertrophy",
    metrics: {
      weight: "78kg",
      height: "180cm",
      bf: "14%",
    },
  },

  // Actions
  updateProfile: (updatedProfile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updatedProfile },
    })),

  updateMetrics: (metrics) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        metrics: { ...state.userProfile.metrics, ...metrics },
      },
    })),

  logout: () => {
    // Backend: POST /auth/logout
    set({
      userProfile: {
        name: "",
        email: "",
        phone: "",
        membership: "",
        status: "",
        joinDate: "",
        goal: "",
        metrics: { weight: "", height: "", bf: "" },
      },
    });
  },
}));

export default useProfileStore;

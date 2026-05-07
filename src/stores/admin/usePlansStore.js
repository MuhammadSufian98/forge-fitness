import { create } from "zustand";
import { subscriptionsApi } from "@/utils/authApi";
import { isRequestCanceled } from "@/utils/axiosInstance";

const usePlansStore = create((set, get) => ({
  athletes: [],
  isLoading: false,
  error: null,
  filter: "All",
  selectedAthlete: null,
  isDrawerOpen: false,

  setFilter: (filter) => set({ filter }),
  setSelectedAthlete: (selectedAthlete) => set({ selectedAthlete }),
  setIsDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  fetchAthletes: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await subscriptionsApi.getAll();
      if (data.success) {
        set({ athletes: data.data, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      if (isRequestCanceled(err)) {
        set({ isLoading: false });
        return;
      }

      set({ error: "Failed to fetch athletes", isLoading: false });
    }
  },

  approveSubscription: async (requestId, action) => {
    set({ isLoading: true, error: null });
    try {
      const data = await subscriptionsApi.approve(requestId, action);
      if (data.success) {
        // Optimistic update
        set((state) => ({
          athletes: state.athletes.map(a => 
            a._id === requestId ? { ...a, status: action === 'Approve' ? 'Active' : 'Rejected' } : a
          ),
          isLoading: false,
          isDrawerOpen: false
        }));
        // Re-fetch to ensure sync
        await get().fetchAthletes();
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      if (isRequestCanceled(err)) {
        set({ isLoading: false });
        return;
      }

      set({ error: "Action failed", isLoading: false });
    }
  },

  getFilteredAthletes: () => {
    const state = get();
    if (state.filter === "All") {
      return state.athletes;
    }
    return state.athletes.filter((a) => a.tier?.toUpperCase() === state.filter.toUpperCase());
  },
}));

export default usePlansStore;

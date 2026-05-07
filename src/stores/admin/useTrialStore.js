import { create } from "zustand";
import { trialApi } from "@/utils/authApi";

const useTrialStore = create((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,
  isMailOpen: false,
  selectedLead: null,

  setIsMailOpen: (isMailOpen) => set({ isMailOpen }),
  setSelectedLead: (selectedLead) => set({ selectedLead }),

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await trialApi.getAll();
      if (data.success) {
        set({ leads: data.data, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      set({ error: "Failed to fetch leads", isLoading: false });
    }
  },

  replyToLead: async (leadId, subject, message) => {
    set({ isLoading: true, error: null });
    try {
      const data = await trialApi.reply({ leadId, subject, message });
      if (data.success) {
        // Optimistic update
        set((state) => ({
          leads: state.leads.map(l => 
            l._id === leadId ? { ...l, status: 'Replied' } : l
          ),
          isLoading: false,
          isMailOpen: false
        }));
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to send reply", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },
}));

export default useTrialStore;

import { create } from "zustand";
import { trialApi } from "@/utils/authApi";

const initialTrialForm = {
  fullName: "",
  email: "",
  goal: "",
};

const useTrialStore = create((set, get) => ({
  isSubmitted: false,
  isLoading: false,
  error: null,
  form: initialTrialForm,
  setTrialField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  submitTrial: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await trialApi.apply(get().form);
      if (data.success) {
        set({ isSubmitted: true, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      set({ error: "Failed to submit trial application", isLoading: false });
    }
  },
  resetTrial: () => set({ isSubmitted: false, form: initialTrialForm, error: null }),
}));

export default useTrialStore;

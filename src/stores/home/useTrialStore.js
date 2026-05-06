import { create } from "zustand";

const initialTrialForm = {
  fullName: "",
  phone: "",
  goal: "",
};

const useTrialStore = create((set) => ({
  isSubmitted: false,
  form: initialTrialForm,
  setTrialField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  submitTrial: () => set({ isSubmitted: true }),
  resetTrial: () => set({ isSubmitted: false, form: initialTrialForm }),
}));

export default useTrialStore;

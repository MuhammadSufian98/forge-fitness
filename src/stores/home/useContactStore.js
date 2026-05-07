import { create } from "zustand";

const initialContactForm = {
  name: "",
  requestType: "General Support",
  message: "",
};

const useContactStore = create((set) => ({
  isSent: false,
  isLoading: false,
  form: initialContactForm,
  setContactField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  submitContact: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ isSent: true, isLoading: false });
    }, 1000);
  },
  resetContact: () => set({ isSent: false, form: initialContactForm, isLoading: false }),
}));

export default useContactStore;

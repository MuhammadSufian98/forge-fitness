import { create } from "zustand";

const initialContactForm = {
  name: "",
  requestType: "General Support",
  message: "",
};

const useContactStore = create((set) => ({
  isSent: false,
  form: initialContactForm,
  setContactField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  submitContact: () => set({ isSent: true }),
  resetContact: () => set({ isSent: false, form: initialContactForm }),
}));

export default useContactStore;

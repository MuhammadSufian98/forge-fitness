import { create } from "zustand";

const useChatStore = create((set) => ({
  inputValue: "",
  setInputValue: (inputValue) => set({ inputValue }),
  clearInput: () => set({ inputValue: "" }),
}));

export default useChatStore;

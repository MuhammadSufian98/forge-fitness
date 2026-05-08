import { create } from "zustand";
import { aiApi } from "@/utils/AiApi";

const useChatStore = create((set, get) => ({
  inputValue: "",
  messages: [],
  isLoading: false,

  setInputValue: (inputValue) => set({ inputValue }),
  clearInput: () => set({ inputValue: "" }),
  setMessages: (messages) => set({ messages }),

  loadHistory: async () => {
    set({ isLoading: true });
    const result = await aiApi.getGlobalSession();
    if (result.success && result.data?.messages) {
      set({ messages: result.data.messages });
    }
    set({ isLoading: false });
  },

  sendMessage: async (userMsg, user) => {
    // Optimistic update
    const newMsg = { role: "user", content: userMsg, timestamp: new Date() };
    set((state) => ({ 
      messages: [...state.messages, newMsg], 
      isLoading: true 
    }));

    const result = await aiApi.getCoachResponse(userMsg, user);
    
    if (result.success) {
      const aiMsg = { role: "ai", content: result.data.response, timestamp: new Date() };
      set((state) => ({
        messages: [...state.messages, aiMsg],
      }));
    } else {
      set((state) => ({
        messages: [...state.messages, { 
          role: "ai", 
          content: "Failed to connect to AI Coach. Please try again.",
          timestamp: new Date()
        }]
      }));
    }
    set({ isLoading: false });
  }
}));

export default useChatStore;

import { create } from "zustand";
import axios from "axios";

const useScheduleStore = create((set, get) => ({
  selectedClass: null,
  activeDate: new Date().toISOString().split('T')[0],
  isBooking: false,
  error: null,

  openClass: (selectedClass) => set({ selectedClass }),
  closeClass: () => set({ selectedClass: null }),
  setActiveDate: (activeDate) => set({ activeDate }),

  bookClass: async (scheduleId, date) => {
    set({ isBooking: true, error: null });
    try {
      const response = await axios.post('/api/schedule/book', { scheduleId, date });
      if (response.data.success) {
        set({ isBooking: false });
        return { success: true, data: response.data.data };
      } else {
        set({ isBooking: false, error: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        set({ isBooking: false });
        return { success: false, cancelled: true };
      }

      const msg = err.response?.data?.message || "Maximum Capacity Reached";
      set({ isBooking: false, error: msg });
      return { success: false, message: msg };
    }
  }
}));

export default useScheduleStore;

import { create } from "zustand";
import axios from "axios";

const useScheduleStore = create((set, get) => ({
  selectedClass: null,
  activeDate: new Date().toISOString().split('T')[0],
  isBooking: false,
  error: null,
  cache: {}, // { [date]: data }
  lastFetched: {}, // { [date]: timestamp }

  openClass: (selectedClass) => set({ selectedClass }),
  closeClass: () => set({ selectedClass: null }),
  setActiveDate: (activeDate) => set({ activeDate }),

  fetchSchedules: async (date, force = false) => {
    const { cache, lastFetched } = get();
    const cacheKey = date || 'all';

    if (!force && cache[cacheKey] && lastFetched[cacheKey] && (Date.now() - lastFetched[cacheKey] < 120000)) {
      return;
    }

    try {
      const response = await axios.get(`/api/schedule?date=${date}`);
      if (response.data.success) {
        set((state) => ({
          cache: { ...state.cache, [cacheKey]: response.data.data },
          lastFetched: { ...state.lastFetched, [cacheKey]: Date.now() }
        }));
      }
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    }
  },

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

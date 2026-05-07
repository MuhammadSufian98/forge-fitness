import { create } from "zustand";
import { scheduleApi } from "@/utils/authApi";

const useScheduleStore = create((set, get) => ({
  schedules: [],
  isLoading: false,
  error: null,
  dynamicDays: [],
  selectedClass: null,
  isCreateSessionOpen: false,
  activeDate: new Date().toISOString().split('T')[0],

  setSelectedClass: (selectedClass) => set({ selectedClass }),
  setIsCreateSessionOpen: (isCreateSessionOpen) =>
    set({ isCreateSessionOpen }),
  setActiveDate: (activeDate) => set({ activeDate }),
  setDynamicDays: (dynamicDays) => set({ dynamicDays }),

  fetchSchedules: async (date) => {
    set({ isLoading: true, error: null });
    try {
      const params = { role: 'admin' };
      if (date) params.date = date;
      const data = await scheduleApi.getAll(params);
      if (data.success) {
        set({ schedules: data.data, isLoading: false });
      } else {
        set({ error: data.message, isLoading: false });
      }
    } catch (err) {
      set({ error: "Failed to fetch schedules", isLoading: false });
    }
  },

  initializeDynamicDays: () =>
    set(() => {
      const days = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);

        days.push({
          day: futureDate
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase(),
          date: futureDate.getDate(),
          fullDate: futureDate.toISOString().split('T')[0],
        });
      }

      return {
        dynamicDays: days,
        activeDate: today.toISOString().split('T')[0],
      };
    }),

  addSchedule: async (schedule) => {
    set({ isLoading: true, error: null });
    try {
      const data = await scheduleApi.add(schedule);
      if (data.success) {
        await get().fetchSchedules(get().activeDate);
        set({ isCreateSessionOpen: false, isLoading: false });
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to deploy protocol", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },

  deleteSchedule: async (scheduleId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await scheduleApi.delete(scheduleId);
      if (data.success) {
        set((state) => ({
          schedules: state.schedules.filter(s => s._id !== scheduleId),
          isLoading: false
        }));
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to delete schedule", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },

  updateSchedule: async (scheduleId, updates) => {
    set({ isLoading: true, error: null });
    try {
      const data = await scheduleApi.update(scheduleId, updates);
      if (data.success) {
        set((state) => ({
          schedules: state.schedules.map(s => s._id === scheduleId ? { ...s, ...data.data } : s),
          isLoading: false
        }));
        return { success: true };
      } else {
        set({ error: data.message, isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (err) {
      set({ error: "Failed to update schedule", isLoading: false });
      return { success: false, message: "Network error" };
    }
  },

  getSchedulesForDate: (date) => {
    const state = get();
    // API now handles filtering by date if we pass it, 
    // but if we fetch all at once, we filter here.
    // For admin, let's stick to fetching by date for efficiency.
    return state.schedules;
  },
}));

export default useScheduleStore;

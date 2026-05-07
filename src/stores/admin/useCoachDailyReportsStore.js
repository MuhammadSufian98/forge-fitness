import { create } from "zustand";

const useCoachDailyReportsStore = create((set) => ({
  reports: [
    {
      id: 1,
      date: "May 7, 2026",
      totalSessions: 4,
      totalAthletes: 87,
      averageAttendance: "89%",
      highlights: ["All sessions at capacity", "Zero cancellations", "Strong engagement metrics"],
      sessionsSummary: [
        {
          sessionId: "cls-1",
          name: "Elite HIIT Power",
          time: "08:00 AM",
          attended: 24,
          capacity: 25,
          status: "Complete",
        },
        {
          sessionId: "cls-2",
          name: "Recovery Yoga",
          time: "02:00 PM",
          attended: 18,
          capacity: 20,
          status: "Complete",
        },
      ],
    },
    {
      id: 2,
      date: "May 6, 2026",
      totalSessions: 3,
      totalAthletes: 72,
      averageAttendance: "85%",
      highlights: ["Strong session flow", "Positive feedback collected"],
      sessionsSummary: [
        {
          sessionId: "cls-1",
          name: "Elite HIIT Power",
          time: "08:00 AM",
          attended: 23,
          capacity: 25,
          status: "Complete",
        },
      ],
    },
  ],
  selectedReport: null,

  setSelectedReport: (selectedReport) => set({ selectedReport }),

  addReport: (report) =>
    set((state) => ({
      reports: [report, ...state.reports],
    })),

  updateReport: (reportId, updates) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId ? { ...r, ...updates } : r
      ),
    })),
}));

export default useCoachDailyReportsStore;

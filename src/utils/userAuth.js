import apiClient from "./axiosInstance";

export const userAuthApi = {
  // Subscription APIs
  getCurrentSubscription: async () => {
    const response = await apiClient.get("/api/subscriptions/current");
    return response.data;
  },
  applySubscription: async (planData) => {
    const response = await apiClient.post("/api/subscriptions/apply", planData);
    return response.data;
  },

  // Schedule APIs
  getSchedule: async (date) => {
    const response = await apiClient.get("/api/schedule", { params: { date } });
    return response.data;
  },

  // Trainers APIs (Public/Athlete view)
  getTrainers: async () => {
    const response = await apiClient.get("/api/trainers");
    return response.data;
  },

  // Trial API (Public)
  applyTrial: async (trialData) => {
    const response = await apiClient.post("/api/trial/apply", trialData);
    return response.data;
  }
};

// SWR Fetcher wrapper
export const fetcher = (url) => apiClient.get(url).then((res) => res.data);

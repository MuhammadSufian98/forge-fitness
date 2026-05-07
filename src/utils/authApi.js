import apiClient from "./axiosInstance";

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post("/api/auth/login", credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await apiClient.post("/api/auth/signup", userData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.patch("/api/profile/edit", profileData);
    return response.data;
  }
};

export const trainersApi = {
  getAll: async () => {
    const response = await apiClient.get("/api/trainers");
    return response.data;
  },
  add: async (trainerData) => {
    const response = await apiClient.post("/api/trainers", trainerData);
    return response.data;
  },
  update: async (id, trainerData) => {
    const response = await apiClient.patch(`/api/trainers/${id}`, trainerData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/api/trainers/${id}`);
    return response.data;
  }
};

export const scheduleApi = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/schedule", { params });
    return response.data;
  },
  add: async (scheduleData) => {
    const response = await apiClient.post("/api/schedule", scheduleData);
    return response.data;
  },
  update: async (id, scheduleData) => {
    const response = await apiClient.patch(`/api/schedule/${id}`, scheduleData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/api/schedule/${id}`);
    return response.data;
  }
};

export const subscriptionsApi = {
  getAll: async () => {
    const response = await apiClient.get("/api/subscriptions/all");
    return response.data;
  },
  apply: async (planData) => {
    const response = await apiClient.post("/api/subscriptions/apply", planData);
    return response.data;
  },
  approve: async (id, action) => {
    // Requirements say [PATCH] /api/subscriptions/approve
    const response = await apiClient.patch("/api/subscriptions/approve", { requestId: id, action });
    return response.data;
  }
};

export const trialApi = {
  getAll: async () => {
    const response = await apiClient.get("/api/trial/all");
    return response.data;
  },
  apply: async (trialData) => {
    const response = await apiClient.post("/api/trial/apply", trialData);
    return response.data;
  },
  reply: async (replyData) => {
    const response = await apiClient.post("/api/trial/reply", replyData);
    return response.data;
  }
};

export const adminAnalyticsApi = {
  getStats: async () => {
    const response = await apiClient.get("/api/admin/analytics");
    return response.data;
  }
};

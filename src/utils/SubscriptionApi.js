import axiosInstance from "./axiosInstance";

export const subscriptionApi = {
  applyForPlan: async (planData) => {
    try {
      const response = await axiosInstance.post("/api/subscriptions/apply", planData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Subscription application submitted",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to apply for plan",
      };
    }
  },

  getPendingRequests: async () => {
    try {
      const response = await axiosInstance.get("/api/subscriptions/all");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Subscription requests fetched",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch requests",
      };
    }
  },

  updatePlanStatus: async (requestId, action) => {
    try {
      const response = await axiosInstance.patch("/api/subscriptions/approve", { requestId, action });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || `Subscription ${action} successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  },
};

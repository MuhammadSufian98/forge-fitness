import axiosInstance from "./axiosInstance";

export const aiApi = {
  getCoachResponse: async (userMessage, user) => {
    try {
      const payload = {
        message: userMessage,
      };

      const response = await axiosInstance.post("/api/ai-coach", payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reach AI Coach",
      };
    }
  },

  getGlobalSession: async () => {
    try {
      const response = await axiosInstance.get("/api/ai-coach/sessions/global");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch history",
      };
    }
  }
};

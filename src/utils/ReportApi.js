import axiosInstance from "./axiosInstance";

export const reportApi = {
  submitReport: async (reportData) => {
    try {
      const response = await axiosInstance.post("/api/admin/reports", reportData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Report submitted successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to submit report",
      };
    }
  },

  getReports: async () => {
    try {
      const response = await axiosInstance.get("/api/admin/reports");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Reports fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch reports",
      };
    }
  },
};

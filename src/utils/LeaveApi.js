import axiosInstance from "./axiosInstance";

export const leaveApi = {
  submitLeaveRequest: async (leaveData) => {
    try {
      const response = await axiosInstance.post("/api/admin/applications", leaveData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Leave request submitted successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to submit leave request",
      };
    }
  },

  getAllApplications: async () => {
    try {
      const response = await axiosInstance.get("/api/admin/applications");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Applications fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch applications",
      };
    }
  },

  processApplication: async (applicationId, status) => {
    try {
      const response = await axiosInstance.patch("/api/admin/applications", { applicationId, status });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || `Application ${status} successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to process application",
      };
    }
  },
};

import axiosInstance from "./axiosInstance";

export const notificationApi = {
  fetchNotifications: async () => {
    try {
      const response = await axiosInstance.get("/api/admin/notifications");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Notifications fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch notifications",
      };
    }
  },

  markAsRead: async (notificationId = null) => {
    try {
      const response = await axiosInstance.patch("/api/admin/notifications", { notificationId });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Notification marked as read",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to update notification",
      };
    }
  },

  createNotification: async (notificationData) => {
    try {
      // Note: Backend might not have a direct endpoint for creating from client side 
      // but following the requested standard.
      const response = await axiosInstance.post("/api/admin/notifications", notificationData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Notification created successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to create notification",
      };
    }
  },
};

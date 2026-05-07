import { create } from "zustand";
import { authApi } from "@/utils/authApi";

const initialLogin = {
  email: "",
  password: "",
};

const initialSignup = {
  fullName: "",
  email: "",
  password: "",
  role: "athlete",
};

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isVerifying: true,
  login: initialLogin,
  signup: initialSignup,
  isLoading: false,
  error: null,

  setLoginField: (field, value) =>
    set((state) => ({
      login: {
        ...state.login,
        [field]: value,
      },
    })),

  setSignupField: (field, value) =>
    set((state) => ({
      signup: {
        ...state.signup,
        [field]: value,
      },
    })),

  fetchMe: async () => {
    set({ isVerifying: true });
    try {
      const data = await authApi.getMe();
      if (data.success) {
        set({ user: data.data, isAuthenticated: true, isVerifying: false });
        return { success: true, data: data.data };
      } else {
        set({ user: null, isAuthenticated: false, isVerifying: false });
        return { success: false };
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isVerifying: false });
      return { success: false };
    }
  },

  loginSubmit: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(get().login);
      if (data.success) {
        set({ user: data.data, isAuthenticated: true, isLoading: false, login: initialLogin });
        return { success: true, data: data.data };
      } else {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  signupSubmit: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.signup(get().signup);
      if (data.success) {
        set({ isLoading: false, signup: initialSignup });
        return { success: true, message: data.message };
      } else {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  updateUserProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    // Optimistic UI could be implemented here if needed
    try {
      const data = await authApi.updateProfile(profileData);
      if (data.success) {
        set({ user: data.data, isLoading: false });
        return { success: true, message: data.message };
      } else {
        set({ isLoading: false, error: data.message });
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  },

  resetAuth: () => set({ login: initialLogin, signup: initialSignup, isLoading: false, error: null }),
}));

export default useAuthStore;

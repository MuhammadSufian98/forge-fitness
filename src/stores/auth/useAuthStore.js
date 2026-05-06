import { create } from "zustand";

const initialLogin = {
  email: "",
  password: "",
};

const initialSignup = {
  fullName: "",
  email: "",
  password: "",
  goal: "",
};

const useAuthStore = create((set) => ({
  login: initialLogin,
  signup: initialSignup,
  authStatus: "idle",
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
  submitLogin: () => set({ authStatus: "login-submitted" }),
  submitSignup: () => set({ authStatus: "signup-submitted" }),
  resetAuth: () => set({ login: initialLogin, signup: initialSignup, authStatus: "idle" }),
}));

export default useAuthStore;

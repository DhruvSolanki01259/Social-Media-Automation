import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

// Ensure cookies (JWT) are included in every request
axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ✅ SIGNUP
      signup: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await axios.post(`${API_URL}/signup`, userData);
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Signup failed. Please try again.",
          });
        }
      },

      // ✅ LOGIN
      login: async (email, password, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/login`, { email, password });
          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } catch (error) {
          console.error("Login Error:", error.response?.data || error.message);
          set({
            error:
              error.response?.data?.message ||
              "Login failed. Please check your credentials.",
            isLoading: false,
          });
        }
      },

      // ✅ LOGOUT
      logout: async () => {
        try {
          set({ isLoading: true });
          await axios.post(`${API_URL}/logout`);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              "Logout failed. Please try again.",
          });
        }
      },

      // ✅ SET USER MANUALLY (if you refresh or get profile again)
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // ✅ CLEAR ERROR
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

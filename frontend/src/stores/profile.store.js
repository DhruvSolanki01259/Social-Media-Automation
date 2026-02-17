import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/profile`;

axios.defaults.withCredentials = true;

export const useProfileStore = create((set, get) => ({
  user: null,
  socials: {},
  isLoading: false,
  error: null,

  // ✅ GET Profile
  getProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.get(API_URL);
      set({ user: data, socials: data.socials || {}, isLoading: false });
    } catch (err) {
      console.error("Error fetching profile:", err);
      set({
        error:
          err.response?.data?.message || "Failed to fetch profile details.",
        isLoading: false,
      });
    }
  },

  // ✅ UPDATE Profile
  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(API_URL, profileData);
      set({ user: data.user, isLoading: false });
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      set({
        error: err.response?.data?.message || "Failed to update profile.",
        isLoading: false,
      });
      return false;
    }
  },

  // ✅ ADD or UPDATE Socials
  updateSocials: async (socialsData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.put(`${API_URL}/socials`, socialsData);
      set({ user: data.user, socials: data.user.socials, isLoading: false });
      return true;
    } catch (err) {
      console.error("Error updating socials:", err);
      set({
        error: err.response?.data?.message || "Failed to update socials.",
        isLoading: false,
      });
      return false;
    }
  },

  // ✅ DELETE single social platform
  deleteSocial: async (platform) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await axios.delete(`${API_URL}/socials`, {
        data: { platform },
      });
      set({ user: data.user, socials: data.user.socials, isLoading: false });
      return true;
    } catch (err) {
      console.error("Error deleting social:", err);
      set({
        error: err.response?.data?.message || "Failed to delete social.",
        isLoading: false,
      });
      return false;
    }
  },
}));

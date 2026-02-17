import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/posts`;

axios.defaults.withCredentials = true;

export const usePostStore = create(
  persist(
    (set, get) => ({
      posts: [],
      loading: false,
      error: null,
      searchTerm: "",
      filters: {
        category: "",
        platform: "",
        tag: "",
      },

      // ✅ Fetch all posts for authenticated user
      fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.get(API_URL);
          set({ posts: data, loading: false });
        } catch (error) {
          console.error("Error fetching posts:", error);
          set({
            error: error.response?.data?.message || "Failed to load posts",
            loading: false,
          });
        }
      },

      // ✅ Create new post
      createPost: async (postData) => {
        try {
          const { data } = await axios.post(API_URL, postData);
          set({ posts: [data.post, ...get().posts] });
          return data;
        } catch (error) {
          console.error("Error creating post:", error);
          throw error.response?.data || error;
        }
      },

      // ✅ Update post
      updatePost: async (id, updatedData) => {
        try {
          const { data } = await axios.put(`${API_URL}/${id}`, updatedData);
          set({
            posts: get().posts.map((p) =>
              p._id === id ? { ...p, ...data.post } : p
            ),
          });
          return data;
        } catch (error) {
          console.error("Error updating post:", error);
          throw error.response?.data || error;
        }
      },

      // ✅ Delete post
      deletePost: async (id) => {
        try {
          await axios.delete(`${API_URL}/${id}`);
          set({
            posts: get().posts.filter((p) => p._id !== id),
          });
        } catch (error) {
          console.error("Error deleting post:", error);
          throw error.response?.data || error;
        }
      },

      // ✅ Search and filters
      setSearchTerm: (term) => set({ searchTerm: term }),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),

      // ✅ Filtered posts logic
      filteredPosts: () => {
        const { posts, searchTerm, filters } = get();
        if (!posts.length) return [];

        const keyword = searchTerm.trim().toLowerCase();

        return posts.filter((post) => {
          const matchesSearch =
            !keyword ||
            post.title?.toLowerCase().includes(keyword) ||
            post.description?.toLowerCase().includes(keyword);

          const matchesCategory = filters.category
            ? post.category?.toLowerCase() === filters.category.toLowerCase()
            : true;

          const matchesPlatform = filters.platform
            ? post.socialMedia?.some((s) =>
                s.toLowerCase().includes(filters.platform.toLowerCase())
              )
            : true;

          const matchesTag = filters.tag
            ? post.tags?.some((t) =>
                t.toLowerCase().includes(filters.tag.toLowerCase())
              )
            : true;

          return (
            matchesSearch && matchesCategory && matchesPlatform && matchesTag
          );
        });
      },
    }),
    {
      name: "post-storage", // persisted key name
    }
  )
);

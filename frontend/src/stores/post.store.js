import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAxiosWithAuth } from "../lib/axiosWithAuth";

export const usePostStore = create(
  persist(
    (set, get) => ({
      posts: [],
      currentPost: null,
      loading: false,
      error: null,
      api: null,

      /* ---------------- SET AXIOS ---------------- */

      setApi: (getToken) => {
        const api = createAxiosWithAuth(getToken);
        set({ api });
      },

      /* ---------------- FETCH POSTS ---------------- */

      fetchPosts: async () => {
        const { api } = get();
        if (!api) return;

        set({ loading: true, error: null });

        try {
          const res = await api.get("/posts");

          set({
            posts: res.data.posts || [],
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message,
            loading: false,
          });
        }
      },

      /* ---------------- CREATE POST ---------------- */

      createPost: async (postData) => {
        const { api } = get();
        if (!api) return null;

        set({ loading: true, error: null });

        try {
          const res = await api.post("/posts", postData);

          const newPost = res.data.post;

          set((state) => ({
            posts: [newPost, ...state.posts],
            loading: false,
          }));

          return newPost;
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Failed to create post";

          set({
            error: message,
            loading: false,
          });

          return null;
        }
      },

      /* ---------------- UPDATE POST ---------------- */

      updatePost: async (id, postData) => {
        const { api } = get();
        if (!api) return null;

        set({ loading: true, error: null });

        try {
          const res = await api.put(`/posts/${id}`, postData);

          const updatedPost = res.data.post;

          set((state) => ({
            posts: state.posts.map((p) =>
              p._id === id ? updatedPost : p
            ),
            loading: false,
          }));

          return updatedPost;
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message,
            loading: false,
          });

          return null;
        }
      },

      /* ---------------- DELETE POST ---------------- */

      deletePost: async (id) => {
        const { api } = get();
        if (!api) return false;

        set({ loading: true, error: null });

        try {
          await api.delete(`/posts/${id}`);

          set((state) => ({
            posts: state.posts.filter((p) => p._id !== id),
            loading: false,
          }));

          return true;
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message,
            loading: false,
          });

          return false;
        }
      },
    }),
    {
      name: "post-storage", // localStorage key

      /* Persist ONLY posts */
      partialize: (state) => ({
        posts: state.posts,
      }),
    }
  )
);
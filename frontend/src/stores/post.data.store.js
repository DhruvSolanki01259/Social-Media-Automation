import { create } from "zustand";
import axios from "axios";

/* ---------------- INITIAL DATA ---------------- */

const initialPostData = {
  platforms: {
    instagram: {
      caption: "",
      hashtags: [],
      taggedUsers: [],
      location: ""
    },

    linkedin: {
      text: "",
      title: "",
      hashtags: "",
      link: ""
    },

    twitter: {
      text: "",
      hashtags: [],
      mentions: []
    },

    facebook: {
      message: "",
      hashtags: [],
      taggedUsers: [],
      location: ""
    }
  }
};

/* ---------------- STORE ---------------- */

const usePostDataStore = create((set) => ({

  postData: {},

  /* Initialize Empty Data */
  initialData: () => {
    set({
      postData: JSON.parse(JSON.stringify(initialPostData))
    });
  },

  /* Update Specific Field */
  updateField: (platform, field, value) => {
    set((state) => ({
      postData: {
        ...state.postData,
        platforms: {
          ...state.postData.platforms,
          [platform]: {
            ...state.postData.platforms[platform],
            [field]: value
          }
        }
      }
    }));
  }

}));

export default usePostDataStore;
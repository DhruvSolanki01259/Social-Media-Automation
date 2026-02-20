import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Send } from "lucide-react";
import ImageManager from "./Create-Post-Components/ImageManager.jsx";
import TagManager from "./Create-Post-Components/TagManager.jsx";
import ScheduleManager from "./Create-Post-Components/ScheduleManager.jsx";

const CreatePost = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex justify-center items-center px-4 py-8"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#012A4A] dark:text-white text-center mb-6">
          Create New Post
        </h1>

        <form className="space-y-6">
          <ImageManager />

          {/* Title */}
          <div>
            <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5] focus:ring-2 focus:ring-[#2A6F97]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Write your post content..."
              className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5] focus:ring-2 focus:ring-[#2A6F97]"
            />
          </div>

          {/* Tags */}
          <TagManager />

          {/* 🔹 Schedule Toggle */}
          <ScheduleManager />

          {/* Submit */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full bg-[#01497C] dark:bg-[#1B4965] text-white font-medium py-3 rounded-lg hover:bg-[#014F86] dark:hover:bg-[#2A6F97] transition-all"
          >
            Create Post <Send size={18} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;

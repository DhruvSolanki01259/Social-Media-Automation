import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { usePostStore } from "../stores/post.store";
import { useThemeStore } from "../stores/theme.store";
import CreatePost from "../components/CreatePost";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

const ContentStudio = () => {
  const { theme } = useThemeStore();

  const {
    posts,
    fetchPosts,
    loading,
    searchTerm,
    setSearchTerm,
    filteredPosts,
    filters,
    setFilters,
  } = usePostStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Separate uploaded and scheduled posts
  const uploadedPosts = filteredPosts().filter((p) => !p.isScheduled);
  const scheduledPosts = filteredPosts().filter((p) => p.isScheduled);

  return (
    <div
      className="min-h-screen px-6 py-10 transition-colors duration-300
                 bg-[#F8FAFC] dark:bg-gray-900"
    >
      <AnimatePresence mode="wait">
        {!isCreatingPost ? (
          <motion.div
            key="contentStudio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-[#E2E8F0] dark:border-gray-700 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#012A4A] dark:text-white">
                  Content Studio
                </h1>
                <p className="mt-1 text-[#6C757D] dark:text-[#89A0B2]">
                  Manage, search, and schedule your posts effortlessly.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingPost(true)}
                className="
    flex items-center gap-2
    px-5 py-2 rounded-lg
    border border-[#01497C] dark:border-[#61A5C2]
    text-[#01497C] dark:text-[#61A5C2]
    font-medium
    hover:bg-[#01497C] hover:text-white
    dark:hover:bg-[#61A5C2] dark:hover:text-[#012A4A]
    transition-all
  "
              >
                <PlusCircle size={20} className="transition-colors" />
                Create Post
              </button>
            </div>

            {/* Search & Filters */}
            <motion.div
              {...fadeUp(0.1)}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-[#E2E8F0] dark:border-gray-700 px-6 py-8 mb-12"
            >
              <div className="max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search
                      className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-300"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search posts by title, description, or tags..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#E2E8F0] dark:border-gray-700
                                 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5]
                                 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2
                                 focus:ring-[#2A6F97] transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Advanced Filters Button */}
                  <button
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="
    flex items-center gap-2
    bg-[#01497C] dark:bg-[#61A5C2]
    text-white dark:text-[#012A4A]
    font-medium px-5 py-3 rounded-lg shadow-sm
    hover:bg-[#014F86] hover:text-white
    dark:hover:bg-[#89C2D9] dark:hover:text-[#012A4A]
    transition-all whitespace-nowrap
  "
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                    Advanced Filters
                  </button>
                </div>

                {/* Advanced Filters Panel */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8 bg-[#F8FAFC] dark:bg-gray-900 border border-[#E2E8F0] dark:border-gray-700 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-semibold text-[#012A4A] dark:text-white mb-4">
                        Refine your search
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {["Category", "Platform", "Tag"].map((field, idx) => (
                          <div key={idx}>
                            <label className="text-sm text-[#6C757D] dark:text-[#89A0B2] block mb-2">
                              {field}
                            </label>
                            <input
                              type="text"
                              placeholder={`e.g. ${field}`}
                              className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-3 py-2
                                         text-[#013A63] dark:text-[#CBE5F5] bg-white dark:bg-gray-700
                                         focus:ring-2 focus:ring-[#2A6F97] focus:border-[#2A6F97] transition-all"
                              value={filters[field.toLowerCase()]}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  [field.toLowerCase()]: e.target.value,
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() =>
                            setFilters({ category: "", platform: "", tag: "" })
                          }
                          className="text-sm text-[#01497C] dark:text-[#61A5C2] hover:text-[#012A4A] dark:hover:text-white font-medium"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Analytics Overview */}
            <motion.div {...fadeUp(0.15)} className="mb-12">
              <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-6">
                Overview
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Total Posts",
                    value: posts.length,
                    color: "text-[#01497C] dark:text-[#89C2D9]",
                  },
                  {
                    label: "Uploaded Posts",
                    value: uploadedPosts.length,
                    color: "text-[#2A6F97] dark:text-[#A9D6E5]",
                  },
                  {
                    label: "Scheduled Posts",
                    value: scheduledPosts.length,
                    color: "text-[#468FAF] dark:text-[#CBE5F5]",
                  },
                  {
                    label: "Search Active",
                    value: searchTerm ? "Yes" : "No",
                    color: "text-[#6C757D] dark:text-gray-300",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.05)}
                    className="
          bg-white dark:bg-gray-800
          p-5 rounded-xl
          border border-[#E2E8F0] dark:border-gray-700
          shadow-sm hover:shadow-md
          transition-shadow
          text-center
        "
                  >
                    <h3 className={`text-lg font-semibold ${item.color}`}>
                      {item.label}
                    </h3>

                    <p className="text-2xl font-bold text-[#012A4A] dark:text-white mt-2">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Uploaded & Scheduled Posts */}
            {[
              {
                title: "Uploaded Posts",
                list: uploadedPosts,
                empty: "No uploaded posts found.",
              },
              {
                title: "Scheduled Posts",
                list: scheduledPosts,
                empty: "No scheduled posts found.",
              },
            ].map((section, idx) => (
              <motion.section
                key={idx}
                {...fadeUp(0.2 + idx * 0.1)}
                className="mb-14"
              >
                <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-6">
                  {section.title}
                </h2>
                {loading ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                    Loading posts...
                  </p>
                ) : section.list.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {section.list.map((post, i) => (
                      <motion.div
                        key={post._id || i}
                        {...fadeUp(i * 0.05)}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-[#E2E8F0] dark:border-gray-700 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-[#012A4A] dark:text-white mb-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-[#6C757D] dark:text-[#89A0B2] line-clamp-2 mb-3">
                            {post.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags?.map((tag, j) => (
                              <span
                                key={j}
                                className="text-xs bg-[#E0F2FF] dark:bg-[#2C7DA0] text-[#01497C] dark:text-[#CBE5F5] px-2 py-1 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-[#01497C] dark:text-[#61A5C2] mt-auto">
                          <strong>Platforms:</strong>{" "}
                          {post.socialMedia?.join(", ") || "N/A"}
                          <div className="text-xs text-[#6C757D] dark:text-[#89A0B2] mt-1">
                            {section.title === "Scheduled Posts"
                              ? `Scheduled for ${post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : "N/A"}`
                              : `Posted on ${new Date(post.createdAt).toLocaleString()}`}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                    {section.empty}
                  </p>
                )}
              </motion.section>
            ))}
          </motion.div>
        ) : (
          // Create Post Section
          <motion.div
            key="createPost"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setIsCreatingPost(false)}
                className="flex items-center gap-2 text-[#01497C] dark:text-[#61A5C2] hover:text-[#012A4A] dark:hover:text-white font-medium"
              >
                <ArrowLeft size={20} />
                Back to Studio
              </button>
            </div>
            <CreatePost />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentStudio;

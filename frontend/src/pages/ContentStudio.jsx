import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, ChevronDown, ArrowLeft } from "lucide-react";

import { useThemeStore } from "../stores/theme.store";
import { usePostStore } from "../stores/post.store";

import CreatePost from "./CreatePost.jsx";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

/* ---------- SAFE DATE FORMATTER ---------- */

const formatDateTime = (date, time) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return "";

  const formattedDate = parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formattedDate} at ${time}`;
};

const ContentStudio = () => {
  const { theme } = useThemeStore();
  const { posts, fetchPosts, loading } = usePostStore();

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    platform: "",
    tag: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredPosts = () => {
    return posts.filter((p) => {
      const search = searchTerm.toLowerCase();

      const title = p.title?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = p.tags || [];
      const platforms = p.socialMedia || [];

      const matchesSearch =
        title.includes(search) ||
        description.includes(search) ||
        tags.some((tag) => tag.toLowerCase().includes(search));

      const matchesCategory = filters.category
        ? category.includes(filters.category.toLowerCase())
        : true;

      const matchesPlatform = filters.platform
        ? platforms.some((platform) =>
            platform.toLowerCase().includes(filters.platform.toLowerCase()),
          )
        : true;

      const matchesTag = filters.tag
        ? tags.some((tag) =>
            tag.toLowerCase().includes(filters.tag.toLowerCase()),
          )
        : true;

      return matchesSearch && matchesCategory && matchesPlatform && matchesTag;
    });
  };

  const uploadedPosts = filteredPosts().filter((p) => !p.isScheduled);
  const scheduledPosts = filteredPosts().filter((p) => p.isScheduled);

  /* ---------------- POST CARD ---------------- */

  const PostCard = ({ post }) => (
    <motion.div
      {...fadeUp()}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-[#E2E8F0] dark:border-gray-700 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      {post.image && (
        <div className="h-44 w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#012A4A] dark:text-white mb-1">
          {post.title}
        </h3>

        <p className="text-sm text-[#6C757D] dark:text-[#89A0B2] line-clamp-3 mb-3">
          {post.description}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(post.tags || []).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-[#E0F2FF] dark:bg-[#2C7DA0] text-[#01497C] dark:text-[#CBE5F5] px-2 py-1 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* PLATFORMS */}
        <div className="text-sm text-[#01497C] dark:text-[#61A5C2] mt-auto">
          <strong>Platforms:</strong>{" "}
          {post.socialMedia && post.socialMedia.length > 0
            ? post.socialMedia.join(", ")
            : ""}
        </div>

        {/* CATEGORY */}
        {post.category && (
          <div className="text-xs font-medium text-[#01497C] dark:text-[#89C2D9] mb-2">
            Category: {post.category}
          </div>
        )}

        {/* DATE */}
        <div className="text-xs text-[#6C757D] dark:text-[#89A0B2] mt-2">
          {post.isScheduled
            ? `Scheduled for ${formatDateTime(post.scheduledAt.date, post.scheduledAt.time)}`
            : `Posted on ${formatDateTime(post.scheduledAt.date, post.scheduledAt.time)}`}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-6 py-10 transition-colors duration-300 bg-[#F8FAFC] dark:bg-gray-900">
      <AnimatePresence mode="wait">
        {!isCreatingPost ? (
          <motion.div
            key="contentStudio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* HEADER */}

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
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-[#01497C] dark:border-[#61A5C2] text-[#01497C] dark:text-[#61A5C2] font-medium hover:bg-[#01497C] hover:text-white dark:hover:bg-[#61A5C2] dark:hover:text-[#012A4A] transition-all"
              >
                <PlusCircle size={20} />
                Create Post
              </button>
            </div>

            {/* OVERVIEW */}

            <motion.div {...fadeUp(0.15)} className="mb-12">
              <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-6">
                Overview
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Posts", value: posts.length },
                  { label: "Uploaded Posts", value: uploadedPosts.length },
                  { label: "Scheduled Posts", value: scheduledPosts.length },
                  { label: "Search Active", value: searchTerm ? "Yes" : "No" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#E2E8F0] dark:border-gray-700 shadow-sm text-center"
                  >
                    <h3 className="text-lg font-semibold text-[#01497C] dark:text-[#89C2D9]">
                      {item.label}
                    </h3>

                    <p className="text-2xl font-bold text-[#012A4A] dark:text-white mt-2">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* SEARCH + ADVANCED FILTER */}

            <motion.div
              {...fadeUp(0.1)}
              className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-[#E2E8F0] dark:border-gray-700 px-6 py-8 mb-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search
                      className="absolute left-4 top-3.5 text-gray-400"
                      size={20}
                    />

                    <input
                      type="text"
                      placeholder="Search posts by title, description, or tags..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#E2E8F0] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="flex items-center gap-2 bg-[#01497C] text-white px-5 py-3 rounded-lg"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        showAdvanced ? "rotate-180" : ""
                      }`}
                    />
                    Advanced Filters
                  </button>
                </div>

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
                        {["category", "platform", "tag"].map((field) => (
                          <div key={field}>
                            <label className="text-sm text-[#6C757D] block mb-2 capitalize">
                              {field}
                            </label>

                            <input
                              type="text"
                              placeholder={`Search by ${field}`}
                              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 bg-white dark:bg-gray-700"
                              value={filters[field]}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  [field]: e.target.value,
                                })
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() =>
                            setFilters({
                              category: "",
                              platform: "",
                              tag: "",
                            })
                          }
                          className="text-sm text-[#01497C]"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* UPLOADED POSTS */}

            <section className="mb-14">
              <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-6">
                Uploaded Posts
              </h2>

              {loading ? (
                <p className="text-center text-gray-500">Loading posts...</p>
              ) : uploadedPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {uploadedPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No uploaded posts found.
                </p>
              )}
            </section>

            {/* SCHEDULED POSTS */}

            <section>
              <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5] mb-6">
                Scheduled Posts
              </h2>

              {loading ? (
                <p className="text-center text-gray-500">Loading posts...</p>
              ) : scheduledPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {scheduledPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No scheduled posts found.
                </p>
              )}
            </section>
          </motion.div>
        ) : (
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
                className="flex items-center gap-2 text-[#01497C]"
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

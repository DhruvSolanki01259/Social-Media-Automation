import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, ChevronDown, ArrowLeft } from "lucide-react";
import { usePostStore } from "../stores/post.store";
import CreatePost from "../components/CreatePost";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

const ContentStudio = () => {
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

  const uploadedPosts = filteredPosts().filter((p) => !p.isScheduled);
  const scheduledPosts = filteredPosts().filter((p) => p.isScheduled);

  return (
    <div className='min-h-screen bg-[#F8FAFC] px-6 py-10'>
      <AnimatePresence mode='wait'>
        {!isCreatingPost ? (
          <motion.div
            key='contentStudio'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}>
            {/* Header */}
            <div className='flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-[#E2E8F0] pb-6'>
              <div>
                <h1 className='text-3xl font-bold text-[#012A4A]'>
                  Content Studio
                </h1>
                <p className='text-[#6C757D] mt-1'>
                  Manage, search, and schedule your posts effortlessly.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingPost(true)}
                className='flex items-center gap-2 px-5 py-2 rounded-lg border border-[#01497C] text-[#01497C] font-medium hover:bg-[#01497C] hover:text-white transition-all'>
                <PlusCircle size={20} />
                Create Post
              </button>
            </div>

            {/* Search & Filter Section */}
            <motion.div
              {...fadeUp(0.1)}
              className='bg-white shadow-md rounded-2xl border border-[#E2E8F0] px-6 py-8 mb-12'>
              <div className='max-w-4xl mx-auto'>
                {/* Main Search Bar */}
                <div className='flex flex-col sm:flex-row items-center gap-3'>
                  <div className='relative flex-1 w-full'>
                    <Search
                      className='absolute left-4 top-3.5 text-gray-400'
                      size={20}
                    />
                    <input
                      type='text'
                      placeholder='Search posts by title, description, or tags...'
                      className='w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] 
                            text-[#013A63] placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-[#2A6F97] transition-all'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Advanced Filters Button */}
                  <button
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className='flex items-center gap-2 bg-[#01497C] text-white font-medium 
                          px-5 py-3 rounded-lg shadow-sm hover:bg-[#014F86] 
                          transition-all whitespace-nowrap'>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        showAdvanced ? "rotate-180" : ""
                      }`}
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
                      className='mt-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6'>
                      <h3 className='text-lg font-semibold text-[#012A4A] mb-4'>
                        Refine your search
                      </h3>

                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                        <div>
                          <label className='text-sm text-[#6C757D] block mb-2'>
                            Category
                          </label>
                          <input
                            type='text'
                            placeholder='e.g. Marketing'
                            className='w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 
                                  text-[#013A63] bg-white focus:ring-2 focus:ring-[#2A6F97] 
                                  focus:border-[#2A6F97] transition-all'
                            value={filters.category}
                            onChange={(e) =>
                              setFilters({ category: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className='text-sm text-[#6C757D] block mb-2'>
                            Platform
                          </label>
                          <input
                            type='text'
                            placeholder='e.g. Instagram'
                            className='w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 
                                  text-[#013A63] bg-white focus:ring-2 focus:ring-[#2A6F97] 
                                  focus:border-[#2A6F97] transition-all'
                            value={filters.platform}
                            onChange={(e) =>
                              setFilters({ platform: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className='text-sm text-[#6C757D] block mb-2'>
                            Tag
                          </label>
                          <input
                            type='text'
                            placeholder='e.g. #trending'
                            className='w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 
                                  text-[#013A63] bg-white focus:ring-2 focus:ring-[#2A6F97] 
                                  focus:border-[#2A6F97] transition-all'
                            value={filters.tag}
                            onChange={(e) =>
                              setFilters({ tag: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className='flex justify-end mt-6'>
                        <button
                          onClick={() =>
                            setFilters({
                              category: "",
                              platform: "",
                              tag: "",
                            })
                          }
                          className='text-sm text-[#01497C] hover:text-[#012A4A] font-medium'>
                          Clear Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Analytics Overview */}
            <motion.div
              {...fadeUp(0.15)}
              className='mb-12'>
              <h2 className='text-2xl font-semibold text-[#013A63] mb-6'>
                Overview
              </h2>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                {[
                  {
                    label: "Total Posts",
                    value: posts.length,
                    color: "#01497C",
                  },
                  {
                    label: "Uploaded Posts",
                    value: uploadedPosts.length,
                    color: "#2A6F97",
                  },
                  {
                    label: "Scheduled Posts",
                    value: scheduledPosts.length,
                    color: "#468FAF",
                  },
                  {
                    label: "Search Active",
                    value: searchTerm ? "Yes" : "No",
                    color: "#6C757D",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.05)}
                    className='bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm text-center'>
                    <h3
                      className='text-lg font-semibold'
                      style={{ color: item.color }}>
                      {item.label}
                    </h3>
                    <p className='text-2xl font-bold text-[#012A4A] mt-2'>
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
                className='mb-14'>
                <h2 className='text-2xl font-semibold text-[#013A63] mb-6'>
                  {section.title}
                </h2>
                {loading ? (
                  <p className='text-gray-500 text-center py-6'>
                    Loading posts...
                  </p>
                ) : section.list.length > 0 ? (
                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {section.list.map((post, i) => (
                      <motion.div
                        key={post._id || i}
                        {...fadeUp(i * 0.05)}
                        className='bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between'>
                        <div>
                          <h3 className='text-lg font-semibold text-[#012A4A] mb-1'>
                            {post.title}
                          </h3>
                          <p className='text-sm text-[#6C757D] line-clamp-2 mb-3'>
                            {post.description}
                          </p>
                          <div className='flex flex-wrap gap-2 mb-3'>
                            {post.tags?.map((tag, j) => (
                              <span
                                key={j}
                                className='text-xs bg-[#E0F2FF] text-[#01497C] px-2 py-1 rounded-md'>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className='text-sm text-[#01497C] mt-auto'>
                          <strong>Platforms:</strong>{" "}
                          {post.socialMedia?.join(", ") || "N/A"}
                          <div className='text-xs text-[#6C757D] mt-1'>
                            {section.title === "Scheduled Posts"
                              ? `Scheduled for ${
                                  post.scheduledAt
                                    ? new Date(
                                        post.scheduledAt
                                      ).toLocaleString()
                                    : "N/A"
                                }`
                              : `Posted on ${new Date(
                                  post.createdAt
                                ).toLocaleString()}`}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-center py-6'>
                    {section.empty}
                  </p>
                )}
              </motion.section>
            ))}
          </motion.div>
        ) : (
          // Create Post Section
          <motion.div
            key='createPost'
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}>
            <div className='flex items-center gap-3 mb-6'>
              <button
                onClick={() => setIsCreatingPost(false)}
                className='flex items-center gap-2 text-[#01497C] hover:text-[#012A4A] font-medium'>
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

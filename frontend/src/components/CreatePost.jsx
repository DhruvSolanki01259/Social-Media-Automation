import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Send, X, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../stores/post.store";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

// Example categories
const categories = [
  "Technology",
  "Health",
  "Fitness",
  "Lifestyle",
  "Travel",
  "Education",
  "Business",
  "Finance",
  "Food",
  "Entertainment",
  "Fashion",
  "Sports",
  "Art",
  "Science",
  "Politics",
  "Music",
  "Photography",
  "Gaming",
  "Movies",
  "Books",
];

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePostStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    socialMedia: [],
    category: "",
    isScheduled: false,
    scheduledAt: "",
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [captionSuggestions, setCaptionSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  const typingTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const titleRef = useRef();
  const captionRef = useRef();
  const categoryRef = useRef();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !titleRef.current?.contains(e.target) &&
        !captionRef.current?.contains(e.target) &&
        !categoryRef.current?.contains(e.target)
      ) {
        setTitleSuggestions([]);
        setCaptionSuggestions([]);
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tag input
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  // Form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "socialMedia") {
      setFormData((prev) => ({
        ...prev,
        socialMedia: checked
          ? [...prev.socialMedia, value]
          : prev.socialMedia.filter((sm) => sm !== value),
      }));
    } else if (type === "checkbox" && name === "isScheduled") {
      setFormData((prev) => ({
        ...prev,
        isScheduled: checked,
        scheduledAt: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Schedule date/time
  const handleScheduleChange = (key, value) => {
    setFormData((prev) => {
      const existing = prev.scheduledAt
        ? new Date(prev.scheduledAt)
        : new Date();
      if (key === "date") {
        const [year, month, day] = value.split("-");
        existing.setFullYear(year, month - 1, day);
      } else if (key === "time") {
        const [hours, minutes] = value.split(":");
        existing.setHours(hours, minutes);
      }
      return { ...prev, scheduledAt: existing.toISOString() };
    });
  };

  // Autocomplete
  const fetchAutocomplete = async (text, field) => {
    if (!text.trim()) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/openai/autocomplete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, field }),
          signal: abortControllerRef.current.signal,
        }
      );
      const data = await res.json();
      if (data?.suggestions) {
        field === "title"
          ? setTitleSuggestions(data.suggestions)
          : setCaptionSuggestions(data.suggestions);
        setActiveSuggestion(0);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Autocomplete error:", err);
    }
  };
  const handleTyping = (text, field) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => fetchAutocomplete(text, field),
      600
    );
  };
  const handleSuggestionSelect = (field, suggestion) => {
    if (field === "title")
      setFormData((prev) => ({ ...prev, title: suggestion }));
    else setFormData((prev) => ({ ...prev, description: suggestion }));
    setTitleSuggestions([]);
    setCaptionSuggestions([]);
    setActiveSuggestion(null);
  };
  const handleKeyDown = (e, field) => {
    const suggestions =
      field === "title" ? titleSuggestions : captionSuggestions;
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev === null || prev === suggestions.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev === null || prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (activeSuggestion !== null) {
        e.preventDefault();
        handleSuggestionSelect(field, suggestions[activeSuggestion]);
      }
    }
  };
  const handleClearInput = (field) => {
    if (field === "title") setFormData((prev) => ({ ...prev, title: "" }));
    else setFormData((prev) => ({ ...prev, description: "" }));
  };

  // Media upload
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };
  const removeMedia = (index) =>
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required.");
      setLoading(false);
      return;
    }
    const payload = { ...formData, tags, mediaFiles };
    try {
      await createPost(payload);
      navigate("/content-studio");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestions = (field, suggestions) => (
    <div className='absolute bg-white border border-gray-200 rounded-lg mt-1 shadow-lg w-full z-50 max-h-48 overflow-auto'>
      {suggestions.map((s, i) => (
        <div
          key={i}
          className={`px-3 py-2 text-sm cursor-pointer ${
            activeSuggestion === i
              ? "bg-[#2A6F97] text-white"
              : "text-[#013A63] hover:bg-gray-100"
          }`}
          onClick={() => handleSuggestionSelect(field, s)}>
          {s}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      {...fadeUp(0)}
      className='min-h-screen bg-[#F8FAFC] flex justify-center items-center px-4 py-8'>
      <div className='w-full max-w-2xl bg-white border border-[#E2E8F0] shadow-lg rounded-2xl p-6 sm:p-8 overflow-y-auto'>
        <h1 className='text-2xl sm:text-3xl font-bold text-[#012A4A] text-center mb-6'>
          Create New Post
        </h1>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'>
          {/* Media Upload */}
          <div className='mb-4'>
            <label className='block text-sm text-[#6C757D] mb-2 flex items-center gap-1'>
              <Image size={16} /> Upload Media (One file Only)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#2A6F97] hover:bg-[#F1F5F9] relative`}>
              <p className='text-[#6C757D] text-center'>
                Drag & drop images or videos here, or{" "}
                <span className='text-[#01497C] underline'>browse files</span>
              </p>
              <input
                type='file'
                multiple
                accept='image/*,video/*'
                onChange={handleMediaChange}
                className='absolute w-full h-full opacity-0 cursor-pointer top-0 left-0'
              />
            </div>
            {mediaFiles.length > 0 && (
              <div className='flex flex-wrap gap-3 mt-4'>
                {mediaFiles.map((file, i) => {
                  const isImage = file.type.startsWith("image");
                  return (
                    <div
                      key={i}
                      className='relative w-24 h-24 border border-[#E2E8F0] rounded-lg overflow-hidden'>
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          className='w-full h-full object-cover'
                        />
                      )}
                      <button
                        type='button'
                        onClick={() => removeMedia(i)}
                        className='absolute top-1 right-1 text-white bg-red-600 rounded-full p-1 hover:bg-red-700'>
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Title */}
          <div
            className='relative'
            ref={titleRef}>
            <label className='block text-sm text-[#6C757D] mb-2'>Title</label>
            <div className='relative'>
              <input
                type='text'
                name='title'
                placeholder='Enter post title'
                value={formData.title}
                onChange={(e) => {
                  handleChange(e);
                  handleTyping(e.target.value, "title");
                }}
                onKeyDown={(e) => handleKeyDown(e, "title")}
                className='w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#013A63] bg-[#F9FAFB] focus:ring-2 focus:ring-[#2A6F97] focus:border-[#2A6F97]'
              />
              {formData.title && (
                <button
                  type='button'
                  onClick={() => handleClearInput("title")}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                  <X size={16} />
                </button>
              )}
            </div>
            {titleSuggestions.length > 0 &&
              renderSuggestions("title", titleSuggestions)}
          </div>

          {/* Description */}
          <div
            className='relative'
            ref={captionRef}>
            <label className='block text-sm text-[#6C757D] mb-2'>
              Description
            </label>
            <div className='relative'>
              <textarea
                name='description'
                placeholder='Write your post content...'
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  handleChange(e);
                  handleTyping(e.target.value, "caption");
                }}
                onKeyDown={(e) => handleKeyDown(e, "caption")}
                className='w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[#013A63] bg-[#F9FAFB] focus:ring-2 focus:ring-[#2A6F97] focus:border-[#2A6F97]'
              />
              {formData.description && (
                <button
                  type='button'
                  onClick={() => handleClearInput("description")}
                  className='absolute right-2 top-2 text-gray-400 hover:text-gray-600'>
                  <X size={16} />
                </button>
              )}
            </div>
            {captionSuggestions.length > 0 &&
              renderSuggestions("caption", captionSuggestions)}
          </div>

          {/* Tags */}
          <div className='mb-2'>
            <label className='text-sm text-[#6C757D] font-medium'>Tags</label>
            <div className='flex flex-wrap gap-2 mt-2'>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className='bg-[#A9D6E5] text-[#012A4A] px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                  #{tag}
                  <button
                    type='button'
                    onClick={() => removeTag(i)}
                    className='text-xs hover:text-[#E63946]'>
                    ✕
                  </button>
                </span>
              ))}
              <input
                type='text'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder='Press Enter to add tag'
                className='flex-1 min-w-[120px] px-3 py-1 rounded-xl border border-[#E2E8F0] bg-[#F9FAFB] focus:ring-2 focus:ring-[#2A6F97] text-[#013A63] outline-none'
              />
            </div>
          </div>

          {/* Platforms */}
          <div>
            <label className='block text-sm text-[#6C757D] mb-2'>
              Platforms
            </label>
            <div className='flex flex-wrap gap-4'>
              {["Instagram", "Facebook", "LinkedIn", "Twitter"].map((sm) => (
                <label
                  key={sm}
                  className='flex items-center gap-2 text-[#013A63]'>
                  <input
                    type='checkbox'
                    name='socialMedia'
                    value={sm}
                    checked={formData.socialMedia.includes(sm)}
                    onChange={handleChange}
                  />
                  {sm}
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div
            className='relative'
            ref={categoryRef}>
            <label className='block text-sm text-[#6C757D] mb-2'>
              Category
            </label>

            {/* Selected Category */}
            <div
              className='border border-[#E2E8F0] rounded-lg px-4 py-2 bg-[#F9FAFB] cursor-pointer flex justify-between items-center'
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
              <span>{formData.category || "Select category"}</span>
              <span className='text-gray-400'>
                {showCategoryDropdown ? "▲" : "▼"}
              </span>
            </div>

            {/* Expanded Panel */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: showCategoryDropdown ? "auto" : 0,
                opacity: showCategoryDropdown ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden mt-2 border border-[#E2E8F0] rounded-lg bg-[#F9FAFB]'>
              {/* Search Input */}
              <input
                type='text'
                placeholder='Search category...'
                value={formData.categorySearch || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categorySearch: e.target.value,
                  }))
                }
                className='w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2A6F97]'
              />

              {/* Category List */}
              <div className='max-h-60 overflow-y-auto'>
                {categories
                  .filter((cat) =>
                    cat
                      .toLowerCase()
                      .includes((formData.categorySearch || "").toLowerCase())
                  )
                  .map((cat, i) => (
                    <div
                      key={i}
                      className='px-3 py-2 text-sm hover:bg-[#2A6F97] hover:text-white cursor-pointer'
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          category: cat,
                          categorySearch: "",
                        }));
                        setShowCategoryDropdown(false);
                      }}>
                      {cat}
                    </div>
                  ))}
                {categories.filter((cat) =>
                  cat
                    .toLowerCase()
                    .includes((formData.categorySearch || "").toLowerCase())
                ).length === 0 && (
                  <div className='px-3 py-2 text-sm text-gray-400'>
                    No categories found
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Schedule */}
          <div className='flex items-center gap-3 mt-2'>
            <input
              type='checkbox'
              name='isScheduled'
              checked={formData.isScheduled}
              onChange={handleChange}
            />
            <span className='text-[#013A63] font-medium'>
              Schedule this post
            </span>
          </div>
          {formData.isScheduled && (
            <motion.div
              {...fadeUp(0.1)}
              className='grid sm:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm text-[#6C757D] mb-2 flex items-center gap-2'>
                  <Calendar size={16} /> Date
                </label>
                <input
                  type='date'
                  onChange={(e) => handleScheduleChange("date", e.target.value)}
                  className='w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 bg-[#F9FAFB] focus:ring-2 focus:ring-[#2A6F97] focus:border-[#2A6F97]'
                />
              </div>
              <div>
                <label className='block text-sm text-[#6C757D] mb-2 flex items-center gap-2'>
                  <Clock size={16} /> Time
                </label>
                <input
                  type='time'
                  onChange={(e) => handleScheduleChange("time", e.target.value)}
                  className='w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 bg-[#F9FAFB] focus:ring-2 focus:ring-[#2A6F97] focus:border-[#2A6F97]'
                />
              </div>
            </motion.div>
          )}

          {error && (
            <p className='text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded'>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type='submit'
            disabled={loading}
            className='flex items-center justify-center gap-2 w-full bg-[#01497C] text-white font-medium py-3 rounded-lg hover:bg-[#014F86] transition-all disabled:opacity-70'>
            {loading ? "Creating..." : "Create Post"}
            {!loading && <Send size={18} />}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;

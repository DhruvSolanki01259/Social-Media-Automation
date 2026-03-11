import React, { useState, useRef, useEffect } from "react";

/* ---------------- Categories ---------------- */
const categories = [
  "Adventure",
  "Marketing",
  "Education",
  "Entertainment",
  "News",
  "Lifestyle",
  "Health & Fitness",
  "Food & Recipes",
  "Travel",
  "Technology",
  "Business",
  "Finance",
  "Fashion",
  "Beauty",
  "Gaming",
  "Sports",
  "Music",
  "Photography",
  "DIY & Crafts",
  "Motivation & Inspiration",
  "Science",
  "Politics",
  "Culture",
  "Memes",
  "Other",
];

const ContentStep = ({ postData, setPostData }) => {
  const { title, description, tags, category = "Other" } = postData;

  const [tagInput, setTagInput] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);

  const dropdownRef = useRef();

  /* ---------------- Close Category Dropdown ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- TAG LOGIC ---------------- */
  const handleTagKeyDown = (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = tagInput.trim();

    if (!value || tags.includes(value)) return;

    setPostData((prev) => ({
      ...prev,
      tags: [...prev.tags, value],
    }));

    setTagInput("");
  };

  const removeTag = (index) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const clearAllTags = () => {
    setPostData((prev) => ({
      ...prev,
      tags: [],
    }));

    setTagInput("");
  };

  /* ---------------- Select Category ---------------- */
  const selectCategory = (cat) => {
    setPostData((prev) => ({
      ...prev,
      category: cat,
    }));

    setCategoryOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ---------------- Title ---------------- */}
      <div>
        <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2">
          Title
        </label>

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) =>
            setPostData((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5] focus:ring-2 focus:ring-[#2A6F97]"
        />
      </div>

      {/* ---------------- Category ---------------- */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2">
          Category
        </label>

        {/* Selected Category */}
        <button
          type="button"
          onClick={() => setCategoryOpen((prev) => !prev)}
          className="w-full text-left border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5] flex items-center justify-between focus:ring-2 focus:ring-[#2A6F97]"
        >
          {category}
          <span
            className={`transition-transform ${
              categoryOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Dropdown */}
        {categoryOpen && (
          <div
            className="
            absolute left-0 top-full mt-2 w-full
            bg-white dark:bg-gray-800
            border border-[#E2E8F0] dark:border-gray-700
            rounded-lg shadow-lg z-50
            max-h-60 overflow-y-auto
            scrollbar-hide
          "
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => selectCategory(cat)}
                className="w-full text-left px-4 py-2 text-sm text-[#013A63] dark:text-[#CBE5F5] hover:bg-[#F1F5F9] dark:hover:bg-gray-700 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- Description ---------------- */}
      <div>
        <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2">
          Description
        </label>

        <textarea
          rows={4}
          placeholder="Write your post content..."
          value={description}
          onChange={(e) =>
            setPostData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700 text-[#013A63] dark:text-[#CBE5F5] focus:ring-2 focus:ring-[#2A6F97]"
        />
      </div>

      {/* ---------------- Tags ---------------- */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#6C757D] dark:text-[#89A0B2] font-medium">
            Tags
          </label>

          {tags.length > 0 && (
            <button
              type="button"
              onClick={clearAllTags}
              className="text-xs text-red-500 hover:text-red-600 transition"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#A9D6E5] dark:bg-[#2C7DA0] text-[#012A4A] dark:text-[#CBE5F5] px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-xs hover:text-red-500"
              >
                ✕
              </button>
            </span>
          ))}

          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Press Enter to add tag"
            className="flex-1 min-w-[120px] px-3 py-1 rounded-xl border border-[#E2E8F0] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-700 focus:ring-2 focus:ring-[#2A6F97]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentStep;

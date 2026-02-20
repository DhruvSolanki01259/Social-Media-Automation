import React, { useState } from "react";

const TagManager = () => {
  // 🔹 TAG LOGIC
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;

    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-sm text-[#6C757D] dark:text-[#89A0B2] font-medium">
        Tags
      </label>

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
  );
};

export default TagManager;

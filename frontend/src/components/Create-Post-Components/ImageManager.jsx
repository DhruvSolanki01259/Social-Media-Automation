import { Image, X } from "lucide-react";
import React from "react";

const ImageManager = () => {
  return (
    <div>
      <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2 flex items-center gap-1">
        <Image size={16} /> Upload Media
      </label>

      <div className="border-2 border-dashed border-[#E2E8F0] dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-[#2A6F97] hover:bg-[#F1F5F9] dark:hover:bg-gray-700 relative">
        <p className="text-[#6C757D] dark:text-[#89A0B2] text-center">
          Drag & drop images or videos here, or{" "}
          <span className="text-[#01497C] dark:text-[#61A5C2] underline">
            browse files
          </span>
        </p>
        <input
          type="file"
          className="absolute w-full h-full opacity-0 cursor-pointer top-0 left-0"
        />
      </div>

      {/* Preview UI */}
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="relative w-24 h-24 border border-[#E2E8F0] dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
          <button
            type="button"
            className="absolute top-1 right-1 text-white bg-red-600 rounded-full p-1 hover:bg-red-700"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;

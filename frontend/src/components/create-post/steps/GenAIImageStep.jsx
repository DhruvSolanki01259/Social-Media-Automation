import React, { useState, useEffect, useRef } from "react";
import { Image, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

/* ---------------- Stable AI Mock Images ---------------- */
const mockAIImages = [
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=600",
  "https://images.unsplash.com/photo-1682686581030-2a1c4a1d4f6b?w=600",
  "https://images.unsplash.com/photo-1682686581580-d99b0230064e?w=600",
];

/* ---------------- Cloudinary Config ---------------- */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const GenAIImageStep = ({ postData, setPostData }) => {
  const [aiImages, setAiImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("ai");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  /* ---------------- Sync Mode When Returning ---------------- */
  useEffect(() => {
    if (postData?.mediaUrls?.length > 0) {
      const img = postData.mediaUrls[0];
      setSelected(img);

      if (mockAIImages.includes(img)) {
        setMode("ai");
        setAiImages(mockAIImages);
      } else {
        setMode("manual");
      }
    }
  }, []);

  /* ---------------- Reset File Input On Mode Change ---------------- */
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [mode]);

  /* ---------------- Manual Upload ---------------- */
  const handleUpload = async (e) => {
    if (uploading || postData.mediaUrls?.length > 0) return;

    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
      );

      const imageUrl = res.data.secure_url;

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [imageUrl],
      }));

      setSelected(imageUrl);
      setMode("manual");
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Fake AI Generate ---------------- */
  const generateAIImages = () => {
    setAiImages(mockAIImages);
  };

  /* ---------------- Carousel Rotation ---------------- */
  const rotateLeft = () => {
    setAiImages(([a, b, c]) => [b, c, a]);
  };

  const rotateRight = () => {
    setAiImages(([a, b, c]) => [c, a, b]);
  };

  /* ---------------- Store Center AI Image ---------------- */
  useEffect(() => {
    if (aiImages.length === 3 && mode === "ai") {
      const center = aiImages[1];

      setSelected(center);

      setPostData((prev) => ({
        ...prev,
        mediaUrls: [center],
      }));
    }
  }, [aiImages, mode, setPostData]);

  /* ---------------- Remove Manual Image ---------------- */
  const removeManualImage = () => {
    setPostData((prev) => ({
      ...prev,
      mediaUrls: [],
    }));
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-[#013A63] dark:text-[#CBE5F5]">
        Generate or Upload Image
      </h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 dark:border-gray-600">
        {["ai", "manual"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition
            ${
              mode === tab
                ? "bg-[#01497C] text-white dark:bg-[#61A5C2] dark:text-black"
                : "text-[#013A63] dark:text-[#CBE5F5] hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab === "ai" ? "AI Generated" : "Manual Upload"}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* AI GENERATED */}
      {/* ========================================================= */}

      {mode === "ai" && (
        <>
          {aiImages.length === 3 && (
            <div className="relative flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={rotateLeft}
                className="p-3 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
              >
                <ChevronLeft />
              </button>

              <div className="flex items-center gap-6 relative">
                {aiImages.map((img, index) => {
                  const isCenter = index === 1;

                  return (
                    <motion.div
                      key={img}
                      layout
                      animate={{
                        opacity: isCenter ? 1 : 0.6,
                        scale: isCenter ? 1 : 0.85,
                      }}
                      transition={{ duration: 0.35 }}
                      className={`rounded-xl overflow-hidden shadow-lg ${
                        !isCenter ? "hidden md:block" : ""
                      }`}
                      style={{
                        width: isCenter ? 256 : 160,
                        height: isCenter ? 256 : 160,
                      }}
                    >
                      <img
                        src={img}
                        alt="AI Generated"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/600";
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={rotateRight}
                className="p-3 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition"
              >
                <ChevronRight />
              </button>
            </div>
          )}

          <textarea
            placeholder="Describe the image you want AI to generate..."
            value={postData.prompt}
            onChange={(e) =>
              setPostData((prev) => ({
                ...prev,
                prompt: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-[#E2E8F0] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-700 px-4 py-3 text-[#013A63] dark:text-[#CBE5F5]"
          />

          <button
            type="button"
            onClick={generateAIImages}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#01497C] hover:bg-[#013A63] text-white transition"
          >
            <Sparkles size={16} />
            Generate AI Images
          </button>
        </>
      )}

      {/* ========================================================= */}
      {/* MANUAL UPLOAD */}
      {/* ========================================================= */}

      {mode === "manual" && (
        <div className="mt-4 space-y-4">
          {postData.mediaUrls?.[0] && (
            <div className="relative w-64 h-64 rounded-xl overflow-hidden border shadow-md">
              <img
                src={postData.mediaUrls[0]}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={removeManualImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] flex items-center gap-2">
            <Image size={16} /> Upload Media
          </label>

          <div
            className={`relative border-2 border-dashed border-[#E2E8F0] dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center transition-all
            ${
              uploading || postData.mediaUrls?.length > 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-[#2A6F97] hover:bg-[#F1F5F9] dark:hover:bg-gray-700"
            }`}
          >
            <p className="text-[#6C757D] dark:text-[#89A0B2] text-center">
              Drag & drop images here, or{" "}
              <span className="text-[#01497C] dark:text-[#61A5C2] underline">
                browse files
              </span>
            </p>

            {uploading && (
              <p className="text-sm text-blue-500 mt-2">Uploading...</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={uploading || postData.mediaUrls?.length > 0}
              onChange={handleUpload}
              className="absolute w-full h-full opacity-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenAIImageStep;

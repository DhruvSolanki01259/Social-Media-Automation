import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { InstagramPost } from "../posts/InstagramPost";
import { LinkedInPost } from "../posts/LinkedInPost";
import { FacebookPost } from "../posts/FacebookPost";
import { TwitterPost } from "../posts/TwitterPost";

const platformLabels = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  twitter: "Twitter",
};

const PostPreview = ({ postData, selectedPlatforms }) => {
  const [posts, setPosts] = useState([]);

  /* ---------- Build Preview Data ---------- */

  const previewData = {
    username: "Dhruv Solanki",
    handle: "dhruvdev",
    avatar: "/avatar-placeholder.png",
    caption: postData.description || "Write something amazing...",
    image: postData.mediaUrls?.[0] || "/post-placeholder.png",
  };

  /* ---------- Create Platform Posts ---------- */

  const platformPosts = useMemo(() => {
    const map = {
      instagram: <InstagramPost post={previewData} />,
      linkedin: <LinkedInPost post={previewData} />,
      facebook: <FacebookPost post={previewData} />,
      twitter: <TwitterPost post={previewData} />,
    };

    return selectedPlatforms.map((p) => ({
      name: p,
      label: platformLabels[p],
      component: map[p],
    }));
  }, [selectedPlatforms, postData]);

  useEffect(() => {
    setPosts(platformPosts);
  }, [platformPosts]);

  /* ---------- Rotate Carousel ---------- */

  const rotateLeft = () => {
    setPosts(([first, ...rest]) => [...rest, first]);
  };

  const rotateRight = () => {
    setPosts((arr) => [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)]);
  };

  if (!posts.length) {
    return (
      <div className="flex items-center justify-center w-full h-[420px] text-gray-400 border rounded-xl dark:border-gray-700">
        Select a platform to preview
      </div>
    );
  }

  const centerIndex = Math.floor(posts.length / 2);

  return (
    <div className="flex items-center justify-center mt-10 w-full">
      {/* Left Arrow */}
      {posts.length > 1 && (
        <button
          onClick={rotateLeft}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition mr-4"
        >
          <ChevronLeft />
        </button>
      )}

      {/* Carousel Wrapper */}
      <div className="flex items-center justify-center gap-6 relative">
        {posts.map((post, index) => {
          const isCenter = index === centerIndex;

          return (
            <motion.div
              key={post.name}
              layout
              animate={{
                opacity: isCenter ? 1 : 0.55,
                scale: isCenter ? 1 : 0.85,
              }}
              transition={{ duration: 0.35 }}
              className={`flex flex-col items-center ${
                !isCenter ? "hidden md:flex" : ""
              }`}
            >
              {/* Platform Label */}
              <div
                className={`
                mb-2 text-xs font-semibold px-3 py-1 rounded-full
                bg-gray-200 text-gray-700
                dark:bg-gray-700 dark:text-gray-200
                `}
              >
                {post.label}
              </div>

              {/* Post Container */}
              <div
                className="rounded-xl overflow-hidden shadow-xl border 
                bg-white dark:bg-gray-900 dark:border-gray-700"
                style={{
                  width: isCenter ? 400 : 240,
                  height: isCenter ? 500 : 380,
                }}
              >
                <div className="w-full h-full overflow-y-auto">
                  {post.component}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right Arrow */}
      {posts.length > 1 && (
        <button
          onClick={rotateRight}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition ml-4"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default PostPreview;

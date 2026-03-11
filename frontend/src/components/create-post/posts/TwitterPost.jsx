import { FaRegComment, FaRetweet, FaHeart, FaShare } from "react-icons/fa";
import { useEffect, useState } from "react";
import usePostDataStore from "../../../stores/post.data.store.js";

export const TwitterPost = ({ post = {} }) => {
  const { postData } = usePostDataStore();
  const data = postData?.platforms?.twitter || {};

  const avatar = post.avatar || "/avatar-placeholder.png";
  const image = post.image || "/post-placeholder.png";

  const text = data.text || "";
  const hashtags = data.hashtags?.join(" ") || "";
  const mentions = data.mentions?.join(" ") || "";

  const [time, setTime] = useState("Just now");

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 60000);

      if (diff < 1) setTime("Just now");
      else if (diff < 60) setTime(`${diff}m`);
      else if (diff < 1440) setTime(`${Math.floor(diff / 60)}h`);
      else setTime(`${Math.floor(diff / 1440)}d`);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white p-3">
      <div className="flex gap-3">
        <img src={avatar} className="w-9 h-9 rounded-full object-cover" />

        <div className="flex-1">
          {/* Header */}
          <div className="flex gap-2 text-sm">
            <span className="font-semibold">{post.username}</span>
            <span className="text-gray-500 dark:text-gray-400">
              @{post.handle}
            </span>
            <span className="text-gray-500 dark:text-gray-400">· {time}</span>
          </div>

          {/* Text */}
          <p className="text-sm mt-1">
            {mentions} {text}
          </p>

          {/* Hashtags */}
          <p className="text-[#2A6F97] text-sm">{hashtags}</p>

          {/* Image */}
          <div className="w-full h-[180px] mt-3 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl border dark:border-neutral-700">
            <img src={image} className="max-h-full max-w-full object-contain" />
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-3 text-gray-500 dark:text-gray-400 text-sm max-w-xs">
            <FaRegComment />
            <FaRetweet />
            <FaHeart />
            <FaShare />
          </div>
        </div>
      </div>
    </div>
  );
};

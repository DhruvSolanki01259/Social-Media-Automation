import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaBookmark,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import usePostDataStore from "../../../stores/post.data.store.js";

export const InstagramPost = ({ post = {} }) => {
  const { postData } = usePostDataStore();
  const data = postData?.platforms?.instagram || {};

  const avatar = post.avatar || "/avatar-placeholder.png";
  const image = post.image || "/post-placeholder.png";

  const caption = data.caption || "";
  const hashtags = data.hashtags?.join(" ") || "";

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
    <div className="w-full h-full flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        <img src={avatar} className="w-8 h-8 rounded-full object-cover" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{post.username}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {time}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-[220px] flex items-center justify-center bg-black/5 dark:bg-white/5">
        <img src={image} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Actions */}
      <div className="flex justify-between p-3 text-lg">
        <div className="flex gap-4">
          <FaHeart />
          <FaRegComment />
          <FaPaperPlane />
        </div>
        <FaBookmark />
      </div>

      {/* Caption */}
      <div className="px-3 pb-3 text-sm overflow-hidden">
        <span className="font-semibold mr-2">{post.username}</span>
        {caption}
        <span className="text-[#2A6F97] ml-1">{hashtags}</span>
      </div>
    </div>
  );
};

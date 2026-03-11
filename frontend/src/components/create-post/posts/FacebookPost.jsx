import { FaRegCommentDots, FaShare, FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import usePostDataStore from "../../../stores/post.data.store.js";

export const FacebookPost = ({ post = {} }) => {
  const { postData } = usePostDataStore();
  const data = postData?.platforms?.facebook || {};

  const avatar = post.avatar || "/avatar-placeholder.png";
  const image = post.image || "/post-placeholder.png";

  const message = data.message || "";
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
      <div className="flex gap-3 p-3">
        <img src={avatar} className="w-9 h-9 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold">{post.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {time} · 🌎
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="px-3 text-sm">
        {message} <span className="text-[#2A6F97]">{hashtags}</span>
      </p>

      {/* Image */}
      <div className="w-full h-[200px] flex items-center justify-center mt-2 bg-black/5 dark:bg-white/5">
        <img src={image} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
        <span>👍 320</span>
        <span>54 comments · 12 shares</span>
      </div>

      {/* Actions */}
      <div className="flex justify-around border-t py-2 text-sm dark:border-neutral-700">
        <button className="flex items-center gap-2">
          <FaThumbsUp /> Like
        </button>
        <button className="flex items-center gap-2">
          <FaRegCommentDots /> Comment
        </button>
        <button className="flex items-center gap-2">
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

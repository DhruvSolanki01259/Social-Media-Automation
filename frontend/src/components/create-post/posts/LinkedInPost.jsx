import { FaRegCommentDots, FaShare, FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import usePostDataStore from "../../../stores/post.data.store.js";

export const LinkedInPost = ({ post = {} }) => {
  const { postData } = usePostDataStore();
  const data = postData?.platforms?.linkedin || {};

  const avatar = post.avatar || "/avatar-placeholder.png";
  const image = post.image || "/post-placeholder.png";

  const title = data.title || "";
  const text = data.text || "";
  const hashtags = data.hashtags || "";

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
      {/* Header */}
      <div className="flex gap-3">
        <img src={avatar} className="w-10 h-10 rounded-full object-cover" />

        <div>
          <p className="text-sm font-semibold">{post.username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Software Engineer · {time}
          </p>
        </div>
      </div>

      {/* Title */}
      {title && <p className="mt-3 font-semibold text-sm">{title}</p>}

      {/* Text */}
      <p className="text-sm mt-1">{text}</p>

      {/* Image */}
      <div className="w-full h-[180px] mt-3 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-md border dark:border-neutral-700">
        <img src={image} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Hashtags */}
      <p className="text-[#2A6F97] text-sm mt-2">{hashtags}</p>

      {/* Stats */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>245 reactions</span>
        <span>32 comments</span>
      </div>

      {/* Actions */}
      <div className="flex justify-around border-t mt-2 pt-2 text-sm dark:border-neutral-700">
        <button className="flex gap-2 items-center">
          <FaThumbsUp /> Like
        </button>
        <button className="flex gap-2 items-center">
          <FaRegCommentDots /> Comment
        </button>
        <button className="flex gap-2 items-center">
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
};

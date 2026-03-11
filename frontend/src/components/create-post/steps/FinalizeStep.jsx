import { motion } from "framer-motion";

const FinalizeStep = ({ postData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-[#013A63] dark:text-[#CBE5F5]">
        Final Review
      </h2>

      <p className="text-gray-600 dark:text-gray-400">
        Review your post before publishing.
      </p>

      <div className="grid gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500">Title</p>
          <p className="font-medium">{postData.title || "—"}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p>{postData.description || "—"}</p>
        </div>

        {/* Category */}
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p>{postData.category || "Other"}</p>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm text-gray-500">Tags</p>
          <div className="flex flex-wrap gap-2">
            {postData.tags?.length ? (
              postData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#E0F2FF] dark:bg-[#2C7DA0] text-[#01497C] dark:text-[#CBE5F5] px-2 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p>—</p>
            )}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <p className="text-sm text-gray-500">Platforms</p>
          <p>
            {postData.socialMedia?.length
              ? postData.socialMedia.join(", ")
              : "—"}
          </p>
        </div>

        {/* Schedule */}
        <div>
          <p className="text-sm text-gray-500">Schedule</p>
          <p>
            {postData.isScheduled && postData.scheduledAt
              ? postData.scheduledAt.date + " at " + postData.scheduledAt.time
              : "Post Immediately"}
          </p>
        </div>

        {/* Images */}
        {postData.mediaUrls?.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Images</p>

            <div className="flex gap-3 flex-wrap">
              {postData.mediaUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinalizeStep;

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import React, { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.25 },
};

const ScheduleManager = () => {
  // SCHEDULE LOGIC
  const [isScheduled, setIsScheduled] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isScheduled}
          onChange={() => setIsScheduled((prev) => !prev)}
          className="accent-[#2A6F97]"
        />
        <span className="text-[#013A63] dark:text-[#CBE5F5] font-medium">
          Schedule this post
        </span>
      </div>

      {/* 🔹 Conditional Schedule Inputs */}
      <AnimatePresence>
        {isScheduled && (
          <motion.div {...fadeUp} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2 flex items-center gap-2">
                <Calendar size={16} /> Date
              </label>
              <input
                type="date"
                className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-[#6C757D] dark:text-[#89A0B2] mb-2 flex items-center gap-2">
                <Clock size={16} /> Time
              </label>
              <input
                type="time"
                className="w-full border border-[#E2E8F0] dark:border-gray-700 rounded-lg px-4 py-2.5 bg-[#F9FAFB] dark:bg-gray-700"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScheduleManager;

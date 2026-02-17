import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const logoDrop = {
  hidden: { y: -60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const burst = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.15, 0.9, 3],
    opacity: [1, 1, 0.8, 0],
    transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] },
  },
};

const SplashScreen = ({ onComplete, darkMode = false }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 900);
    }, 3600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  /* ---------------- Theme Colors ---------------- */
  const backgroundColor = darkMode ? "#0B1E30" : "#F8FAFC";
  const textPrimary = darkMode ? "#FFFFFF" : "#012A4A";
  const textSecondary = darkMode ? "#61A5C2" : "#01497C";
  const burstGradient = darkMode
    ? "from-[#61A5C2]/20 to-[#A9D6E5]/25"
    : "from-[#01497C]/20 to-[#61A5C2]/25";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          initial={{ opacity: 1, backgroundColor }}
          animate={{ opacity: 1, backgroundColor }}
          exit={{
            opacity: 0,
            backgroundColor: "rgba(0,0,0,0)",
            transition: { duration: 0.9, ease: "easeInOut" },
          }}
        >
          {/* Main logo + text */}
          <motion.div
            className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            }}
          >
            <motion.img
              src="/app-logo.png"
              alt="Social Media Automation"
              className="max-w-[160px] sm:max-w-[200px] h-auto drop-shadow-xl"
              style={{ objectFit: "contain" }}
              variants={logoDrop}
              initial="hidden"
              animate="visible"
            />

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <motion.h1
                custom={0.4}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className={`text-4xl sm:text-5xl font-bold tracking-tight`}
                style={{ color: textPrimary }}
              >
                Social Media
              </motion.h1>

              <motion.h1
                custom={0.7}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className={`text-4xl sm:text-5xl font-bold tracking-tight`}
                style={{ color: textSecondary }}
              >
                Automation
              </motion.h1>
            </div>
          </motion.div>

          {/* Burst effect */}
          <motion.div
            variants={burst}
            initial="initial"
            animate="animate"
            className={`absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-2xl bg-gradient-to-r ${burstGradient}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

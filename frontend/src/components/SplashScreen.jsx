import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../stores/theme.store";
import LoadingSpinner from "../components/LoadingSpinner";

/* ---------------- Animations ---------------- */
const containerFade = {
  initial: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
  },
};

const logoDrop = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const textVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: (delay) => ({
    y: 0,
    opacity: 1,
    transition: { delay, duration: 0.5 },
  }),
};

const burst = {
  animate: {
    scale: [1, 1.2, 0.9, 3],
    opacity: [1, 1, 0.6, 0],
    transition: { duration: 1.2 },
  },
};

const SplashScreen = ({ onComplete }) => {
  const { theme } = useThemeStore();
  const resolvedTheme = theme || "dark"; // 🔑 CRITICAL
  const isDark = resolvedTheme === "dark";

  const [phase, setPhase] = useState("splash");

  const themeTokens = {
    bg: isDark ? "#0B1220" : "#F8FAFC",
    primary: isDark ? "#FFFFFF" : "#012A4A",
    secondary: isDark ? "#90DBF4" : "#01497C",
    burst: isDark
      ? "from-[#1E3A8A]/30 to-[#38BDF8]/30"
      : "from-[#01497C]/20 to-[#61A5C2]/25",
  };

  /* 🔒 Background lock */
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.backgroundColor = themeTokens.bg;
    body.style.backgroundColor = themeTokens.bg;

    return () => {
      requestAnimationFrame(() => {
        root.style.backgroundColor = "";
        body.style.backgroundColor = "";
      });
    };
  }, [themeTokens.bg]);

  /* ⏱ Timeline */
  useEffect(() => {
    const splash = setTimeout(() => setPhase("spinner"), 2800);
    const done = setTimeout(() => {
      onComplete?.();
    }, 4200);

    return () => {
      clearTimeout(splash);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          variants={containerFade}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: themeTokens.bg }}
        >
          {phase === "splash" && (
            <>
              <motion.div className="flex flex-col sm:flex-row items-center gap-6">
                <motion.img
                  src="/app-logo.png"
                  className="max-w-[180px]"
                  variants={logoDrop}
                  initial="hidden"
                  animate="visible"
                />

                <div>
                  <motion.h1
                    custom={0.2}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl font-bold"
                    style={{ color: themeTokens.primary }}
                  >
                    Social Media
                  </motion.h1>

                  <motion.h1
                    custom={0.45}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-4xl font-bold"
                    style={{ color: themeTokens.secondary }}
                  >
                    Automation
                  </motion.h1>
                </div>
              </motion.div>

              <motion.div
                variants={burst}
                animate="animate"
                className={`absolute w-72 h-72 rounded-full blur-3xl bg-gradient-to-r ${themeTokens.burst}`}
              />
            </>
          )}

          {phase === "spinner" && <LoadingSpinner darkMode={isDark} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

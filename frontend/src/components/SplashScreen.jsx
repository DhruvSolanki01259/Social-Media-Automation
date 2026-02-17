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

const SplashScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 1. Animation duration (logo + text + burst)
    const timer = setTimeout(() => {
      // 2. Trigger fade-out after burst
      setVisible(false);
      // 3. Allow fade animation to finish before unmount
      setTimeout(() => onComplete?.(), 900);
    }, 3600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className='fixed inset-0 flex items-center justify-center z-[9999]'
          initial={{ opacity: 1, backgroundColor: "#F8FAFC" }}
          animate={{ opacity: 1, backgroundColor: "#F8FAFC" }}
          exit={{
            opacity: 0,
            backgroundColor: "rgba(248,250,252,0)",
            transition: { duration: 0.9, ease: "easeInOut" },
          }}>
          {/* Main logo + text */}
          <motion.div
            className='relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-6'
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            }}>
            <motion.img
              src='/app-logo.png'
              alt='Social Media Automation'
              className='max-w-[160px] sm:max-w-[200px] h-auto drop-shadow-xl'
              style={{ objectFit: "contain" }}
              variants={logoDrop}
              initial='hidden'
              animate='visible'
            />

            <div className='flex flex-col items-center sm:items-start text-center sm:text-left'>
              <motion.h1
                custom={0.4}
                variants={textVariants}
                initial='hidden'
                animate='visible'
                className='text-4xl sm:text-5xl font-bold text-[#012A4A] tracking-tight'>
                Social Media
              </motion.h1>

              <motion.h1
                custom={0.7}
                variants={textVariants}
                initial='hidden'
                animate='visible'
                className='text-4xl sm:text-5xl font-bold text-[#01497C] tracking-tight'>
                Automation
              </motion.h1>
            </div>
          </motion.div>

          {/* Burst effect */}
          <motion.div
            variants={burst}
            initial='initial'
            animate='animate'
            className='absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-r from-[#01497C]/20 to-[#61A5C2]/25 blur-2xl'
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

import { motion } from "framer-motion";

const LoadingSpinner = ({ darkMode = false }) => {
  const borderBase = darkMode ? "#1E3A5F" : "#E2E8F0";
  const borderTop = darkMode ? "#61A5C2" : "#01497C";
  const bg = darkMode ? "#0B1E30" : "#F8FAFC";

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: bg }}
    >
      <motion.div
        className="w-14 h-14 rounded-full border-4"
        style={{
          borderColor: borderBase,
          borderTopColor: borderTop,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;

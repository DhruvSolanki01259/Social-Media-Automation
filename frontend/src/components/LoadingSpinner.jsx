import { motion } from "framer-motion";

const LoadingSpinner = ({
  label = "Loading",
  overlay = false,
  withBackdrop = false, // 👈 new control
}) => {
  return (
    <div
      className={`
        inset-0 z-50 flex items-center justify-center
        ${overlay ? "absolute" : "fixed"}
        ${withBackdrop ? "bg-spinner-bg backdrop-blur-sm" : "bg-transparent"}
      `}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="h-12 w-12 rounded-full border-2"
          style={{
            borderColor: "var(--spinner-ring-base)",
            borderTopColor: "var(--spinner-ring-accent)",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />

        <motion.p
          className="text-sm tracking-wide select-none text-spinner-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

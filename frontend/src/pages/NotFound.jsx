import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: "easeOut" },
});

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-20 
                        bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300"
    >
      <motion.div
        {...fadeUp(0.2)}
        className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700
                   rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 p-12
                   w-full max-w-lg text-center"
      >
        {/* ⚠️ Error Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <AlertTriangle className="w-16 h-16 text-[#E63946] dark:text-red-500" />
          <h1 className="text-5xl font-extrabold mt-6 text-[#012A4A] dark:text-white">
            404
          </h1>
          <h2 className="text-2xl font-semibold mt-2 text-[#01497C] dark:text-[#61A5C2]">
            Page Not Found
          </h2>
          <p className="text-[#6C757D] dark:text-gray-400 mt-3 text-base leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved.
            Please check the URL or return to the home page.
          </p>
        </motion.div>

        {/* 🏠 Return Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mt-10 flex items-center justify-center gap-2 bg-[#01497C] dark:bg-[#61A5C2] 
                     text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#014F86] dark:hover:bg-[#89C2D9] 
                     transition-all duration-300 shadow-md hover:shadow-lg w-full"
        >
          <Home className="w-5 h-5" />
          Go Back Home
        </motion.button>
      </motion.div>
    </section>
  );
};

export default NotFound;

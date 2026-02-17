import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1E30]'>
      <motion.div
        className='w-14 h-14 border-4 border-[#E2E8F0] dark:border-[#1E3A5F] border-t-[#01497C] dark:border-t-[#61A5C2] rounded-full'
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;

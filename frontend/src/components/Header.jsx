import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuthStore();

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const tabAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  // 🧭 Navigation Tabs (dynamic)
  const tabs = [
    { label: "About Us", path: "/about-us" },
    { label: "Contact", path: "/contact" },
    { label: "View Analytics", path: "/analytics" },
  ];

  if (isAuthenticated) {
    tabs.splice(2, 0, { label: "Content Studio", path: "/content-studio" }); // insert dynamically
  }

  return (
    <header
      className='w-full fixed top-0 left-0 z-30 
      bg-[#F8FAFC] border-b border-[#E2E8F0] 
      shadow-sm backdrop-blur-md'>
      <div className='max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4 h-16'>
        {/* 🌐 App Logo */}
        <motion.img
          src='/app-logo.png'
          alt='App Logo'
          onClick={() => handleNavigate("/")}
          className='w-28 sm:w-32 h-auto cursor-pointer select-none object-contain -ml-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* 🧭 Navigation Tabs */}
        <nav className='hidden md:flex items-center gap-8 text-[#013A63] font-medium'>
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.path}
              onClick={() => handleNavigate(tab.path)}
              custom={i}
              variants={tabAnimation}
              initial='hidden'
              animate='visible'
              className='relative group transition-all duration-300'>
              <span className='hover:text-[#01497C] transition-colors duration-300'>
                {tab.label}
              </span>
              <span className='absolute left-0 bottom-[-4px] w-0 group-hover:w-full h-[2px] bg-[#01497C] transition-all duration-500 ease-in-out'></span>
            </motion.button>
          ))}
        </nav>

        {/* 🎛️ Right Controls */}
        <div className='hidden md:flex items-center gap-4 relative'>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className='w-9 h-9 flex items-center justify-center rounded-full 
              bg-[#FFFFFF] border border-[#E2E8F0] 
              hover:bg-[#A9D6E5]/40 transition text-[#01497C]'>
            {isDarkMode ? (
              <Moon className='w-4 h-4' />
            ) : (
              <Sun className='w-4 h-4' />
            )}
          </motion.button>

          {/* ✅ User Avatar or Sign Up */}
          {isAuthenticated && user ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src={
                user.profilePic ||
                "https://via.placeholder.com/40x40.png?text=U"
              }
              alt='Profile'
              className='w-9 h-9 rounded-full border-2 border-[#61A5C2] object-cover cursor-pointer shadow-sm hover:shadow-md transition-all'
              onClick={() => handleNavigate("/profile")}
            />
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavigate("/signup")}
              className='px-4 py-1.5 rounded-full font-semibold border-2 
                border-[#01497C] text-[#01497C] hover:bg-[#01497C] hover:text-[#FFFFFF] transition-all duration-400 ease-in-out text-sm'>
              Sign Up
            </motion.button>
          )}
        </div>

        {/* 📱 Mobile Controls */}
        <div className='flex md:hidden items-center gap-2'>
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className='w-9 h-9 flex items-center justify-center rounded-full 
              bg-[#FFFFFF] border border-[#E2E8F0] 
              hover:bg-[#A9D6E5]/40 transition text-[#01497C]'>
            {isDarkMode ? (
              <Moon className='w-4 h-4' />
            ) : (
              <Sun className='w-4 h-4' />
            )}
          </motion.button>

          {/* Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='p-2 rounded-md hover:bg-[#E2E8F0]/50 
              text-[#013A63] transition'
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </motion.button>
        </div>
      </div>

      {/* 📱 Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.5 }}
            className='md:hidden bg-[#FFFFFF] border-t border-[#E2E8F0] shadow-md'>
            <div className='flex flex-col px-6 py-4 space-y-3 text-[#013A63] font-medium'>
              {tabs.map((tab, i) => (
                <motion.button
                  key={tab.path}
                  onClick={() => handleNavigate(tab.path)}
                  custom={i}
                  variants={tabAnimation}
                  initial='hidden'
                  animate='visible'
                  className='text-left rounded-md px-3 py-2 hover:bg-[#A9D6E5]/25 transition-all duration-300'>
                  {tab.label}
                </motion.button>
              ))}

              {/* 🔄 Mobile Auth Options */}
              {!isAuthenticated ? (
                <motion.button
                  onClick={() => handleNavigate("/signup")}
                  custom={4}
                  variants={tabAnimation}
                  initial='hidden'
                  animate='visible'
                  className='px-5 py-2 rounded-md border-2 
                    border-[#01497C] text-[#01497C] hover:bg-[#01497C] hover:text-[#FFFFFF] transition-all duration-400 ease-in-out text-center'>
                  Sign Up
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={() => handleNavigate("/profile")}
                    className='flex items-center gap-2 px-4 py-2 rounded-md border 
                      border-[#61A5C2] text-[#01497C] hover:bg-[#A9D6E5]/25 transition-all duration-300'>
                    <User className='w-4 h-4' /> Go to Profile
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className='flex items-center gap-2 px-4 py-2 rounded-md border 
                      border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white transition-all duration-300'>
                    <LogOut className='w-4 h-4' /> Logout
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useThemeStore } from "../stores/theme.store.js";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // ✅ Zustand theme store
  const { theme, toggleTheme } = useThemeStore();

  // ✅ Apply theme on mount and whenever it changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
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

  const tabs = [
    { label: "About Us", path: "/about-us" },
    { label: "Contact", path: "/contact" },
    { label: "View Analytics", path: "/analytics" },
  ];

  if (isSignedIn)
    tabs.splice(2, 0, { label: "Content Studio", path: "/content-studio" });

  if (!isLoaded) return null;

  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between h-16">
        <motion.img
          src="/app-logo.png"
          alt="App Logo"
          onClick={() => handleNavigate("/")}
          className="w-28 cursor-pointer select-none -ml-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        />

        <nav className="hidden md:flex gap-8 text-gray-900 dark:text-white font-medium">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.path}
              onClick={() => handleNavigate(tab.path)}
              custom={i}
              variants={tabAnimation}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <span className="hover:text-blue-800 dark:hover:text-blue-400 transition">
                {tab.label}
              </span>
              <span className="absolute left-0 bottom-[-4px] w-0 group-hover:w-full h-[2px] bg-blue-800 dark:bg-blue-400 transition-all" />
            </motion.button>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border flex items-center justify-center text-blue-800 dark:text-white transition-colors duration-300"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </motion.button>

          {isSignedIn ? (
            <motion.img
              src={user.imageUrl}
              alt="Profile"
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-full border-2 border-blue-400 cursor-pointer"
              onClick={() => handleNavigate("/profile")}
            />
          ) : (
            <motion.button
              onClick={() => handleNavigate("/signup")}
              whileHover={{ scale: 1.03 }}
              className="
                px-4 py-1.5 rounded-full
                border-2 border-blue-800 dark:border-blue-400
                text-blue-800 dark:text-blue-400
                hover:bg-blue-800 hover:text-white
                dark:hover:bg-blue-400 dark:hover:text-gray-900
                transition-colors duration-300
              "
            >
              Sign Up
            </motion.button>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border flex items-center justify-center text-blue-800 dark:text-white transition-colors duration-300"
          >
            {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          </motion.button>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="md:hidden bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md transition-colors duration-300"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.path}
                  onClick={() => handleNavigate(tab.path)}
                  className="text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  {tab.label}
                </button>
              ))}

              {!isSignedIn ? (
                <button
                  onClick={() => handleNavigate("/signup")}
                  className="
                    border-2 border-blue-800 dark:border-blue-400
                    text-blue-800 dark:text-blue-400
                    px-4 py-2 rounded
                    hover:bg-blue-800 hover:text-white
                    dark:hover:bg-blue-400 dark:hover:text-gray-900
                    transition-colors duration-300
                  "
                >
                  Sign Up
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center gap-2 border px-4 py-2 rounded"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-colors duration-300"
                  >
                    <LogOut size={16} /> Logout
                  </button>
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

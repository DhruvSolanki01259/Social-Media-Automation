import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";

import Home from "./pages/Home";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./stores/auth.store";
import ContentStudio from "./pages/ContentStudio";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public route wrapper (redirect to /profile if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/profile" replace /> : children;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem("visited", "true");
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          <SplashScreen onComplete={() => setShowSplash(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<About />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LogIn />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/content-studio"
                element={
                  <ProtectedRoute>
                    <ContentStudio />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;

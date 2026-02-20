import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

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
import ContentStudio from "./pages/ContentStudio";
import SsoCallback from "./components/SsoCallback";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";

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
          transition={{ duration: 1 }}
        >
          <Layout>
            <Routes>
              {/* Public */}
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

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              {/* Protected */}
              {/* <Route
  path="/verify-email"
  element={
    <ProtectedRoute>
    <VerifyEmail />
    </ProtectedRoute>
    }
    /> */}

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

              {/* Verify Email */}
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* SSO Callback */}
              <Route path="/sso-callback" element={<SsoCallback />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;

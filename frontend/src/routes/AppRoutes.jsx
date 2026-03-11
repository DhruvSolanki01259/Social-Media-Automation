import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Layout from "../components/Layout";

import Home from "../pages/Home";
import About from "../pages/AboutUs";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import Analytics from "../pages/Analytics";
import SignUp from "../pages/SignUp";
import LogIn from "../pages/LogIn";
import NotFound from "../pages/NotFound";
import ContentStudio from "../pages/ContentStudio";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";

import OAuthCallback from "../pages/OAuthCallback";

import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Routes location={location}>
            {/* PUBLIC ROUTES */}

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
              path="/oauth-callback"
              element={
                <PublicRoute>
                  <OAuthCallback />
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

            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* PROTECTED ROUTES */}

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

            {/* 404 */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default AppRoutes;

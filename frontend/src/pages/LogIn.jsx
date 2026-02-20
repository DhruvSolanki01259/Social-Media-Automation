import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";

import Input from "../components/Input";
import { useThemeStore } from "../stores/theme.store";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();

  const { theme } = useThemeStore(); // ✅ SINGLE SOURCE
  const isDark = theme === "dark"; // ✅ FIX

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- EMAIL + PASSWORD LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/profile");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OAUTH LOGIN ---------------- */
  const handleSocialLogin = async (provider) => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/profile",
      });
    } catch (err) {
      console.error("OAuth login error:", err);
    }
  };

  /* ---------------- THEME COLORS ---------------- */
  const bgPrimary = isDark ? "bg-[#0B1E30]" : "bg-[#F8FAFC]";
  const cardBg = isDark
    ? "bg-[#102A43] border-[#1E3A5F]"
    : "bg-white border-[#E2E8F0]";
  const leftBg = isDark
    ? "bg-[#1E3A5F] border-r-[#2C7DA0]"
    : "bg-[#F1F5F9] border-r-[#E2E8F0]";
  const textPrimary = isDark ? "text-[#E0F2FF]" : "text-[#012A4A]";
  const textSecondary = isDark ? "text-[#61A5C2]/80" : "text-[#013A63]/80";
  const inputBg = isDark
    ? "bg-[#1E3A5F] text-[#E0F2FF] border-[#2C7DA0]"
    : "bg-[#F9FAFB] text-[#013A63] border-[#E2E8F0]";
  const buttonBg = isDark
    ? "bg-[#61A5C2] hover:bg-[#89C2D9]"
    : "bg-[#01497C] hover:bg-[#014F86]";

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${bgPrimary}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`flex w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden ${cardBg}`}
      >
        {/* LEFT */}
        <div
          className={`hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 ${leftBg}`}
        >
          <img src="/login-image.png" className="w-96 mb-6" />
          <h3 className={`${textPrimary} text-3xl font-bold text-center`}>
            Manage Your Presence Effortlessly
          </h3>
          <p className={`${textSecondary} text-center mt-2`}>
            Access your automation dashboard securely.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-8">
          <div className="w-full max-w-md">
            <h2
              className={`text-3xl font-bold text-center mb-6 ${textPrimary}`}
            >
              Welcome Back
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                icon={Mail}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBg}
              />

              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputBg}
              />

              {/* FORGOT PASSWORD */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className={`text-sm font-medium ${
                    isDark ? "text-[#61A5C2]" : "text-[#01497C]"
                  } hover:underline`}
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="text-[#E63946] text-sm text-center font-medium">
                  {error}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold ${buttonBg}`}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Log In"
                )}
              </motion.button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center my-6">
              <hr
                className={`flex-grow ${isDark ? "border-[#2C7DA0]" : "border-[#E2E8F0]"}`}
              />
              <span
                className={`mx-3 text-sm ${isDark ? "text-[#61A5C2]" : "text-[#6C757D]"}`}
              >
                or continue with
              </span>
              <hr
                className={`flex-grow ${isDark ? "border-[#2C7DA0]" : "border-[#E2E8F0]"}`}
              />
            </div>

            {/* OAUTH */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSocialLogin("google")}
                className={`flex items-center gap-2 px-5 py-2.5 border rounded-lg ${
                  isDark
                    ? "border-[#2C7DA0] hover:bg-[#1E3A5F]"
                    : "hover:bg-[#F1F5F9]"
                }`}
              >
                <FcGoogle className="w-5 h-5" /> Google
              </button>

              <button
                onClick={() => handleSocialLogin("github")}
                className={`flex items-center gap-2 px-5 py-2.5 border rounded-lg ${
                  isDark
                    ? "border-[#2C7DA0] hover:bg-[#1E3A5F]"
                    : "hover:bg-[#F1F5F9]"
                }`}
              >
                <Github className="w-5 h-5" /> GitHub
              </button>
            </div>

            <p className={`mt-6 text-center text-sm ${textSecondary}`}>
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className={`font-medium ${
                  isDark ? "text-[#61A5C2]" : "text-[#01497C]"
                } hover:underline`}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

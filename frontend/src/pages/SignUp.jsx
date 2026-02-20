import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Loader, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";

import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Input from "../components/Input";
import { useThemeStore } from "../stores/theme.store";

const SignUp = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp } = useSignUp();

  const { theme } = useThemeStore(); // ✅ SINGLE SOURCE
  const isDark = theme === "dark"; // ✅ FIX

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- EMAIL + PASSWORD SIGNUP ---------------- */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "missing_requirements") {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        navigate("/verify-email");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err?.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OAUTH ---------------- */
  const handleOAuth = async (provider) => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/profile",
      });
    } catch (err) {
      console.error("OAuth error:", err);
    }
  };

  /* ---------------- THEME COLORS ---------------- */
  const bgPrimary = isDark ? "bg-[#0B1E30]" : "bg-[#F8FAFC]";
  const cardBg = isDark
    ? "bg-[#102A43] border-[#1E3A5F]"
    : "bg-white border-[#E2E8F0]";
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
        <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <h2
              className={`text-3xl font-bold text-center mb-6 ${textPrimary}`}
            >
              Create Your Account
            </h2>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div id="clerk-captcha" />

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

              <PasswordStrengthMeter password={password} darkMode={isDark} />

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
                className={`
                  w-full py-3 rounded-lg font-semibold
                  transition-colors duration-200
                  ${buttonBg}
                  text-white
                  hover:text-white
                  dark:text-white
                  dark:hover:text-white
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin mx-auto text-white" />
                ) : (
                  "Sign Up"
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
                onClick={() => handleOAuth("google")}
                className={`flex items-center gap-2 px-5 py-2.5 border rounded-lg ${
                  isDark
                    ? "border-[#2C7DA0] hover:bg-[#1E3A5F]"
                    : "hover:bg-[#F1F5F9]"
                }`}
              >
                <FcGoogle className="w-5 h-5" /> Google
              </button>

              <button
                onClick={() => handleOAuth("github")}
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
              Already have an account?{" "}
              <Link to="/login" className="font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`hidden md:flex md:w-1/2 border-l p-10 items-center justify-center flex-col ${
            isDark
              ? "bg-[#1E3A5F] border-[#2C7DA0]"
              : "bg-[#F1F5F9] border-l-[#E2E8F0]"
          }`}
        >
          <img src="/signup-image.png" className="w-96 mb-6" />
          <h3 className={`${textPrimary} text-3xl font-bold`}>
            Automate Your Social Growth
          </h3>
          <p className={`${textSecondary} text-center mt-2`}>
            Simplify your workflow with powerful automation.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

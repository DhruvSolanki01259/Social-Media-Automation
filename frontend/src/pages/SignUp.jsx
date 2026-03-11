import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

import { useSignUp, useAuth } from "@clerk/clerk-react";
import axios from "../lib/axios";

import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Input from "../components/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import { useThemeStore } from "../stores/theme.store";

const SignUp = () => {
  const navigate = useNavigate();

  const { signUp, setActive, isLoaded } = useSignUp();
  const { getToken } = useAuth();

  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  /* ---------- UTIL: FULLNAME → USERNAME ---------- */

  const generateUsername = (name) => {
    return (
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") + Math.floor(Math.random() * 1000)
    );
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // console.log("Creating Clerk user...");

      const names = fullName.trim().split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || "";

      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err) {
      console.error(err);
      setError(err?.errors?.[0]?.message || "Signup failed");
    }

    setLoading(false);
  };

  /* ---------------- VERIFY EMAIL ---------------- */

  const verifyEmail = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // console.log("User verified and logged in");

        const username = generateUsername(fullName);

        /* ---------- CREATE USER IN MONGODB ---------- */

        const token = await getToken();

        await axios.post(
          "/api/user/create",
          {
            username,
            fullName,
            email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err?.errors?.[0]?.message || "Verification failed");
    }

    setLoading(false);
  };

  /* ---------------- OAUTH ---------------- */

  const signUpGoogle = async () => {
    await signUp.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/oauth-callback",
      redirectUrlComplete: "/",
    });
  };

  const signUpGithub = async () => {
    await signUp.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/oauth-callback",
      redirectUrlComplete: "/",
    });
  };

  /* ---------------- THEME ---------------- */

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
        className={`relative flex w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden border ${cardBg}`}
      >
        {loading && <LoadingSpinner overlay label="Processing…" withBackdrop />}

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {!verifying ? (
              <>
                <h2
                  className={`text-3xl font-bold text-center mb-6 ${textPrimary}`}
                >
                  Create Your Account
                </h2>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <Input
                    icon={User}
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputBg}
                  />

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

                  <PasswordStrengthMeter
                    password={password}
                    darkMode={isDark}
                  />

                  {error && (
                    <p className="text-[#E63946] text-sm text-center font-medium">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white ${buttonBg}`}
                  >
                    Sign Up
                  </button>
                </form>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={signUpGoogle}
                    className="flex items-center gap-2 px-5 py-2.5 border rounded-lg"
                  >
                    <FcGoogle className="w-5 h-5" />
                    Google
                  </button>

                  <button
                    onClick={signUpGithub}
                    className="flex items-center gap-2 px-5 py-2.5 border rounded-lg"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </button>
                </div>

                <p className={`mt-6 text-center text-sm ${textSecondary}`}>
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium hover:underline">
                    Login
                  </Link>
                </p>
              </>
            ) : (
              <>
                <h2
                  className={`text-2xl font-bold text-center mb-6 ${textPrimary}`}
                >
                  Verify Your Email
                </h2>

                <form onSubmit={verifyEmail} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={inputBg}
                  />

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-semibold text-white ${buttonBg}`}
                  >
                    Verify Email
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`hidden md:flex md:w-1/2 border-l p-10 items-center justify-center flex-col ${
            isDark
              ? "bg-[#1E3A5F] border-[#2C7DA0]"
              : "bg-[#F1F5F9] border-[#E2E8F0]"
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

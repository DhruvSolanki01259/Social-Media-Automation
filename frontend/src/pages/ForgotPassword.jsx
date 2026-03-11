import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";

import Input from "../components/Input";
import { useThemeStore } from "../stores/theme.store";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();

  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = verify + reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  /* ---------------- STEP 1: SEND RESET CODE ---------------- */
  const sendResetCode = async (e) => {
    e.preventDefault();
    if (!isLoaded || !email) return;

    setLoading(true);
    setError("");

    try {
      // Request reset code from Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStep(2); // move to verification + reset step
    } catch (err) {
      console.error("Send reset code error:", err);
      setError(err?.errors?.[0]?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2: VERIFY + RESET + AUTO LOGIN ---------------- */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (!verificationCode || !newPassword || !isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: verificationCode,
        password: newPassword,
      });

      if (result.status === "complete") {
        // Activate the new session
        await setActive({ session: result.createdSessionId });
        navigate("/profile");
      } else {
        setError("Reset incomplete, please try again");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err?.errors?.[0]?.message || "Invalid or expired code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP INPUT HANDLING ---------------- */
  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      value
        .slice(0, 6)
        .split("")
        .forEach((char, i) => (newCode[i] = char));
      setCode(newCode);
      inputRefs.current[Math.min(value.length, 5)]?.focus();
      return;
    }
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${bgPrimary}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md rounded-2xl shadow-lg p-8 border ${cardBg}`}
      >
        <h2 className={`text-3xl font-bold text-center mb-4 ${textPrimary}`}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <p className={`text-center text-sm mb-6 ${textSecondary}`}>
          {step === 1
            ? "Enter your email to receive a reset code."
            : "Enter the code sent to your email and set a new password."}
        </p>

        {step === 1 && (
          <form onSubmit={sendResetCode} className="space-y-4">
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBg}
            />

            {error && (
              <p className="text-[#E63946] text-sm text-center">{error}</p>
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
                "Send Reset Code"
              )}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-lg border outline-none ${inputBg}`}
                />
              ))}
            </div>

            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputBg}
            />

            {error && (
              <p className="text-[#E63946] text-sm text-center">{error}</p>
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
                "Reset Password"
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

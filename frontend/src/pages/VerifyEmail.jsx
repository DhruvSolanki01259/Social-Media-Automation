import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { Loader } from "lucide-react";

import { useThemeStore } from "../stores/theme.store.js";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();

  const { theme } = useThemeStore(); // "light" | "dark"
  const isDark = theme === "dark"; // ✅ FIX

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------- REDIRECT IF ALREADY VERIFIED -------- */
  useEffect(() => {
    if (!isLoaded) return;
    if (signUp?.status === "complete") navigate("/");
  }, [isLoaded, signUp, navigate]);

  /* -------- OTP INPUT LOGIC -------- */
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
      setCode(newCode);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
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

  /* -------- VERIFY EMAIL -------- */
  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;

    try {
      setLoading(true);
      setError("");

      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "Invalid verification code");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* -------- AUTO SUBMIT -------- */
  useEffect(() => {
    if (code.every((digit) => digit !== "")) handleVerify();
  }, [code]);

  /* -------- THEME COLORS (FIXED) -------- */
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
      className={`min-h-screen flex items-center justify-center px-4 ${bgPrimary}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md rounded-2xl border shadow-lg p-8 ${cardBg}`}
      >
        <h2 className={`text-3xl font-bold text-center mb-2 ${textPrimary}`}>
          Verify Your Email
        </h2>

        <p className={`text-center text-sm mb-6 ${textSecondary}`}>
          Enter the 6-digit code sent to your email address
        </p>

        <div className="flex justify-between gap-2 mb-5">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl font-bold rounded-lg border outline-none transition-all
                ${inputBg}
                focus:ring-2 focus:ring-[#2C7DA0]/60`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[#E63946] text-sm text-center font-medium mb-3">
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading || code.some((d) => !d)}
          onClick={handleVerify}
          className={`w-full py-3 rounded-lg text-white font-semibold ${buttonBg}`}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Verify Email"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

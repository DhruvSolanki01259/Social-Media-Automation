import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

const Input = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  darkMode = false, // new prop for day/night
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type dynamically for password fields
  const inputType = type === "password" && showPassword ? "text" : type;

  const handleClear = () => {
    if (onChange) onChange({ target: { value: "" } });
  };

  // Theme-based classes
  const bgColor = darkMode ? "bg-[#102A43]" : "bg-[#F1F5F9]";
  const borderColor = darkMode ? "border-[#1E3A5F]" : "border-[#E2E8F0]";
  const textColor = darkMode ? "text-[#E0F2FF]" : "text-[#012A4A]";
  const placeholderColor = darkMode
    ? "placeholder:text-[#89A0B2]"
    : "placeholder:text-[#6C757D]";
  const focusRing = darkMode
    ? "focus:ring-[#61A5C2]/50 focus:border-[#61A5C2]"
    : "focus:ring-[#61A5C2]/60 focus:border-[#61A5C2]";
  const hoverBorder = darkMode
    ? "hover:border-[#61A5C2]/40"
    : "hover:border-[#61A5C2]/70";

  return (
    <div className="flex flex-col space-y-1">
      {/* Label */}
      {label && (
        <label
          className={`text-sm font-semibold ${darkMode ? "text-[#E0F2FF]" : "text-[#013A63]"}`}
          htmlFor={props.id || props.name}
        >
          {label}
        </label>
      )}

      {/* Input with Icon and Actions */}
      <div className="relative">
        {/* Left-side Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon
              className={
                darkMode ? "w-5 h-5 text-[#61A5C2]" : "w-5 h-5 text-[#2A6F97]"
              }
            />
          </div>
        )}

        {/* Input Field */}
        <input
          {...props}
          type={inputType}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-10 py-2
            ${bgColor} ${borderColor} rounded-lg
            ${placeholderColor} ${textColor} font-medium
            focus:ring-2 ${focusRing}
            ${hoverBorder}
            outline-none transition-all duration-200`}
        />

        {/* Right-side Icons */}
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute inset-y-0 right-3 flex items-center ${darkMode ? "text-[#89A0B2]" : "text-[#6C757D]"} hover:text-[#61A5C2] transition`}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        ) : (
          value && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute inset-y-0 right-3 flex items-center ${darkMode ? "text-[#89A0B2]" : "text-[#6C757D]"} hover:text-[#61A5C2] transition`}
              aria-label="Clear input"
            >
              <X className="w-5 h-5" />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Input;

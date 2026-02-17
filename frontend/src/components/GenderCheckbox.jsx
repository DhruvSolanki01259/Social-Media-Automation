import { motion } from "framer-motion";
import { User, UserRound } from "lucide-react";

const GenderCheckbox = ({
  selectedGender,
  onCheckboxChange,
  darkMode = false,
}) => {
  const options = [
    { label: "Male", value: "boy", icon: User },
    { label: "Female", value: "girl", icon: UserRound },
  ];

  return (
    <div className="mt-3">
      {/* Section Label */}
      <p
        className={`text-sm font-semibold mb-2 ${darkMode ? "text-[#E0F2FF]" : "text-[#013A63]"}`}
      >
        Select Gender
      </p>

      {/* Gender Options */}
      <div className="flex items-center gap-4">
        {options.map((opt) => {
          const isSelected = selectedGender === opt.value;

          const baseBorder = darkMode ? "border-[#1E3A5F]" : "border-[#E2E8F0]";
          const hoverBorder = darkMode
            ? "hover:border-[#61A5C2] hover:bg-[#102A43]"
            : "hover:border-[#61A5C2] hover:bg-[#F1F5F9]";
          const selectedBg = darkMode ? "bg-[#61A5C2]/20" : "bg-[#E0F2FF]/60";
          const selectedBorder = darkMode
            ? "border-[#61A5C2]"
            : "border-[#01497C]";
          const textColor = darkMode
            ? isSelected
              ? "text-[#E0F2FF]"
              : "text-[#89A0B2]"
            : isSelected
              ? "text-[#012A4A]"
              : "text-[#6C757D]";
          const iconColor = darkMode
            ? isSelected
              ? "text-[#61A5C2]"
              : "text-[#89A0B2]"
            : isSelected
              ? "text-[#01497C]"
              : "text-[#6C757D]";

          return (
            <motion.label
              key={opt.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-300
                ${isSelected ? `${selectedBorder} ${selectedBg} shadow-sm` : `${baseBorder} ${hoverBorder}`}`}
            >
              <input
                type="radio"
                name="gender"
                value={opt.value}
                checked={isSelected}
                onChange={() => onCheckboxChange(opt.value)}
                className="hidden"
              />

              {/* Icon */}
              <opt.icon className={`w-4 h-4 ${iconColor}`} />

              {/* Label Text */}
              <span className={`font-medium ${textColor}`}>{opt.label}</span>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
};

export default GenderCheckbox;

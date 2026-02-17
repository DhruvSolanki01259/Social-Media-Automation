import { motion } from "framer-motion";
import { User, UserRound } from "lucide-react";

const GenderCheckbox = ({ selectedGender, onCheckboxChange }) => {
  const options = [
    { label: "Male", value: "boy", icon: User },
    { label: "Female", value: "girl", icon: UserRound },
  ];

  return (
    <div className='mt-3'>
      {/* Section Label */}
      <p className='text-sm font-semibold text-[#013A63] mb-2'>Select Gender</p>

      {/* Gender Options */}
      <div className='flex items-center gap-4'>
        {options.map((opt) => (
          <motion.label
            key={opt.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all duration-300
              ${
                selectedGender === opt.value
                  ? "border-[#01497C] bg-[#E0F2FF]/60 shadow-sm"
                  : "border-[#E2E8F0] hover:border-[#61A5C2] hover:bg-[#F1F5F9]"
              }`}>
            <input
              type='radio'
              name='gender'
              value={opt.value}
              checked={selectedGender === opt.value}
              onChange={() => onCheckboxChange(opt.value)}
              className='hidden'
            />

            {/* Icon */}
            <opt.icon
              className={`w-4 h-4 ${
                selectedGender === opt.value
                  ? "text-[#01497C]"
                  : "text-[#6C757D]"
              }`}
            />

            {/* Label Text */}
            <span
              className={`font-medium ${
                selectedGender === opt.value
                  ? "text-[#012A4A]"
                  : "text-[#6C757D]"
              }`}>
              {opt.label}
            </span>
          </motion.label>
        ))}
      </div>
    </div>
  );
};

export default GenderCheckbox;

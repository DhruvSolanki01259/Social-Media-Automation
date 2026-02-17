import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password, darkMode }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-3 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="w-4 h-4 text-[#2ECC71] mr-2" />
          ) : (
            <X className="w-4 h-4 text-[#E63946] mr-2" />
          )}
          <span
            className={`transition-all duration-200 ${
              item.met
                ? darkMode
                  ? "text-[#E0F2FF] font-semibold" // light in dark mode
                  : "text-[#012A4A] font-semibold"
                : darkMode
                  ? "text-[#89A0B2]" // muted dark
                  : "text-[#6C757D]"
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password, darkMode = false }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const colors = darkMode
    ? [
        "bg-[#E63946]",
        "bg-[#F4A261]",
        "bg-[#2C7DA0]",
        "bg-[#2ECC71]",
        "bg-[#61A5C2]",
      ]
    : [
        "bg-[#E63946]",
        "bg-[#F4A261]",
        "bg-[#2C7DA0]",
        "bg-[#2ECC71]",
        "bg-[#01497C]",
      ];

  const textColors = darkMode
    ? [
        "text-[#E63946]",
        "text-[#F4A261]",
        "text-[#2C7DA0]",
        "text-[#2ECC71]",
        "text-[#61A5C2]",
      ]
    : [
        "text-[#E63946]",
        "text-[#F4A261]",
        "text-[#2C7DA0]",
        "text-[#2ECC71]",
        "text-[#01497C]",
      ];

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      default:
        return "Strong";
    }
  };

  return (
    <div className="mt-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-xs ${darkMode ? "text-[#89A0B2]" : "text-[#6C757D]"}`}
        >
          Password Strength
        </span>
        <span className={`text-xs font-medium ${textColors[strength]}`}>
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1/4 rounded-full transition-all duration-500 ease-in-out ${
              index < strength
                ? colors[strength]
                : darkMode
                  ? "bg-[#1E3A5F]"
                  : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </div>

      {/* Criteria */}
      <PasswordCriteria password={password} darkMode={darkMode} />
    </div>
  );
};

export default PasswordStrengthMeter;

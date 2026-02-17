import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className='mt-3 space-y-1'>
      {criteria.map((item) => (
        <div
          key={item.label}
          className='flex items-center text-xs'>
          {item.met ? (
            <Check className='w-4 h-4 text-[#2ECC71] mr-2' />
          ) : (
            <X className='w-4 h-4 text-[#E63946] mr-2' />
          )}
          <span
            className={`transition-all duration-200 ${
              item.met
                ? "text-[#012A4A] font-semibold" // darker & bolder when met
                : "text-[#6C757D]" // muted when unmet
            }`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-[#E63946]";
      case 1:
        return "bg-[#F4A261]";
      case 2:
        return "bg-[#2C7DA0]";
      case 3:
        return "bg-[#2ECC71]";
      default:
        return "bg-[#01497C]";
    }
  };

  const getTextColor = (strength) => {
    switch (strength) {
      case 0:
        return "text-[#E63946]";
      case 1:
        return "text-[#F4A261]";
      case 2:
        return "text-[#2C7DA0]";
      case 3:
        return "text-[#2ECC71]";
      default:
        return "text-[#01497C]";
    }
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className='mt-3'>
      {/* Header */}
      <div className='flex justify-between items-center mb-1'>
        <span className='text-xs text-[#6C757D]'>Password Strength</span>
        <span className={`text-xs font-medium ${getTextColor(strength)}`}>
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Progress Bars */}
      <div className='flex space-x-1'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1/4 rounded-full transition-all duration-500 ease-in-out ${
              index < strength ? `${getColor(strength)}` : "bg-[#E2E8F0]" // neutral divider tone
            }`}
          />
        ))}
      </div>

      {/* Criteria */}
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;

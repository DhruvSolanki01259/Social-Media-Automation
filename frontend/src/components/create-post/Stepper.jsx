const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 dark:bg-gray-700 -z-10" />

        <div
          className="absolute top-4 left-0 h-[2px] bg-[#2A6F97] transition-all duration-500 -z-10"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((label, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div
              key={label}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Circle */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all
                ${
                  isCompleted
                    ? "bg-[#2A6F97] text-white"
                    : isActive
                      ? "bg-white border-2 border-[#2A6F97] text-[#2A6F97] dark:bg-gray-900"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-sm font-medium text-center transition
                ${
                  isActive
                    ? "text-[#013A63] dark:text-[#CBE5F5]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

import { useEffect, useState } from "react";

export default function FormTextArea({
  label,
  name,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  maxLength,
  errors = {},
  noMb,
}) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errors[name]) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors[name]]);

  return (
    <div className={`flex flex-col gap-[5px] ${noMb ? "mb-0" : "mb-4"}`}>
      {label && (
        <label
          htmlFor={name}
          className="col-span-3 font-medium text-gray-700 input-text-size"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="col-span-9">
        <textarea
          id={name}
          name={name}
          value={value || ""}
          placeholder={placeholder || label}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full px-[10px] py-[10px] border input-text-size border-gray-400/60 rounded-[4px] transition-shadow duration-300 bg-white text-black mb-0 placeholder-[#959cb6] 
            focus:outline-none 
            disabled:bg-[#e5e7eb] disabled:cursor-not-allowed
            ${
              errors[name] && showError
                ? "ring-1 ring-red-500"
                : "focus:ring-0 focus:shadow-[0_0_4px_2px_rgba(30,74,233,0.2)]"
            }`}
        />
        {errors[name] && showError && (
          <span className="text-xs text-red-500">{errors[name]}</span>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  maxLength,
  minLength,
  isInvisible,
  min,
  max,
  errors = {},
  noMb = false,
}) {
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (errors[name]) {
      setShowError(true);

      if (
        errors[name] !== "Invalid email format!" &&
        !errors[name].startsWith("Identity Number with ")
      ) {
        const timer = setTimeout(() => {
          setShowError(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [errors[name]]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordField = type === "password";
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div
      className={`flex flex-col gap-[5px] w-full ${noMb ? "mb-0" : "mb-4"} ${
        isInvisible ? "opacity-0" : ""
      }`}
    >
      {label && (
        <label
          htmlFor={name}
          className="col-span-3 font-medium text-gray-700 input-text-size"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative col-span-9">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value || ""}
          placeholder={placeholder || label}
          onChange={onChange}
          required={required}
          onBlur={onBlur}
          disabled={disabled}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          className={`w-full border border-gray-400/60 px-[10px] max-h-[32px] input-text-size py-[10px] rounded-[4px] transition-shadow duration-100 bg-white focus:outline-none text-black mb-0 placeholder-[#959cb6] disabled:bg-[#e5e7eb] disabled:cursor-not-allowed ${
            isPasswordField ? "pr-10" : ""
          }
            ${
              errors[name] && showError
                ? "ring-1 ring-red-500"
                : " focus:ring-0 focus:shadow-[0_0_4px_2px_rgba(30,74,233,0.2)]"
            }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

        {errors[name] && showError && (
          <div className="absolute top-[32px] left-0 w-full mt-1 h-[100px]">
            <div className="text-xs leading-[14px] text-red-500">
              {errors[name]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

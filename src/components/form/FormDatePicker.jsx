import { useEffect, useState } from "react";

export default function FormDatePicker({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  min,
  max,
  errors = {},
  isSelectTime = false,
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
    <div className="flex flex-col gap-[5px] mb-4 w-full">
      <label
        htmlFor={name}
        className="col-span-3 font-medium text-gray-700 input-text-size"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative col-span-9">
        <input
          type={isSelectTime ? "datetime-local" : "date"}
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring ${
            errors[name] ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors[name] && showError && (
          <span className="absolute bottom-[-17px] left-0 w-full mt-1 text-xs text-red-500">
            {errors[name]}
          </span>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

export default function FormInputColor({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  isInvisible,
  errors = {},
  noMb = false,
  showPreview = true,
  maxLength,
}) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errors[name]) {
      setShowError(true);

      if (
        errors[name] !== "Invalid color format!" &&
        !errors[name].startsWith("Color with ")
      ) {
        const timer = setTimeout(() => {
          setShowError(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [errors[name]]);

  const handleColorChange = (color) => {
    const event = {
      target: {
        name: name,
        value: color,
      },
    };
    onChange(event);
  };

  const handleInputChange = (e) => {
    onChange(e);
  };

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
        <div className="flex gap-2">
          {/* Color Input */}
          <div className="relative flex-1">
            <input
              type="text"
              id={name}
              name={name}
              value={value || ""}
              placeholder={placeholder || "Enter hex color (e.g., #FF6B6B)"}
              onChange={handleInputChange}
              required={required}
              onBlur={onBlur}
              maxLength={maxLength}
              disabled={disabled}
              className={`w-full border border-gray-400/60 px-[10px] max-h-[32px] input-text-size py-[10px] rounded-[4px] transition-shadow duration-100 bg-white focus:outline-none text-black mb-0 placeholder-[#959cb6] disabled:bg-[#e5e7eb] disabled:cursor-not-allowed pr-10
                ${
                  errors[name] && showError
                    ? "ring-1 ring-red-500"
                    : " focus:ring-0 focus:shadow-[0_0_4px_2px_rgba(30,74,233,0.2)]"
                }`}
            />

            {/* Color Preview */}
            {showPreview && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div
                  className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded"
                  style={{
                    backgroundColor:
                      value && value.match(/^#[0-9A-Fa-f]{6}$/)
                        ? value
                        : "#ffffff",
                  }}
                >
                  {(!value || !value.match(/^#[0-9A-Fa-f]{6}$/)) && (
                    <Palette className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Native Color Picker */}
          <input
            type="color"
            value={
              value && value.match(/^#[0-9A-Fa-f]{6}$/) ? value : "#000000"
            }
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={disabled}
            className="w-10 h-[32px] rounded border border-gray-400/60 cursor-pointer disabled:cursor-not-allowed"
            title="Choose color"
          />
        </div>

        {errors[name] && showError && (
          <div className="absolute top-[32px] left-0 w-full mt-1 h-[100px] z-10">
            <div className="text-xs leading-[14px] text-red-500">
              {errors[name]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

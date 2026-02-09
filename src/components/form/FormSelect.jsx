import { useRef, useEffect, useState } from "react";
import Select from "react-select";

export default function FormSelect({
  label,
  name,
  options = [],
  value,
  onChange,
  required,
  disabled,
  isLoading,
  errors = {},
  placeholder,
  isBlurAfterSelect = false,
  noMb = false,
  isClearable,
}) {
  const selectRef = useRef(null);

  const [showError, setShowError] = useState(false);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: "1px solid rgba(156, 163, 175, 0.6)",
      padding: "1px",
      borderRadius: "4px",
      backgroundColor: disabled ? "#e5e7eb" : "#ffffff",
      color: "black",
      maxWidth: "100%",
      appearance: "none",
      boxShadow: "none",
      cursor: disabled ? "not-allowed" : "default",
      minHeight: "28.4px",
      ...(errors[name] && showError
        ? {
            boxShadow: "0 0 0 1px #ef4444",
          }
        : state.isFocused
        ? {
            boxShadow: "0 0 4px 2px rgba(30, 74, 233, 0.2)",
          }
        : {}),
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "28.4px",
      padding: "0 4px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#959cb6",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "28.4px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      zIndex: 5,
    }),
    loadingIndicator: (provided, state) => ({
      ...provided,
      color: state.isLoading ? "blue" : "gray",
      padding: "10px",
    }),
  };

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
    <div className={`flex flex-col ${noMb ? "mb-0" : "mb-4"}`}>
      <label className="col-span-3 font-medium text-gray-700 input-text-size">
        {label && (
          <label className="block input-text-size font-medium text-gray-700 mb-[5px]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </label>
      <div className="relative col-span-9">
        <Select
          ref={selectRef}
          id={name}
          name={name}
          options={options}
          value={value}
          onChange={(selected) => {
            onChange({
              target: {
                name: name,
                value: selected?.value,
              },
            });

            if (isBlurAfterSelect && selectRef.current) {
              selectRef.current.blur();
            }
          }}
          isDisabled={disabled || isLoading}
          isLoading={isLoading}
          placeholder={`Select ${placeholder || label}`}
          className="input-text-size"
          classNamePrefix="react-select"
          isClearable={isClearable}
          styles={customStyles}
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

import Select from "react-select";

export default function FormSelectMultiple({
  label,
  name,
  options = [],
  value,
  onChange,
  required,
  disabled,
  isLoading,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-[5px] mb-4">
      {label && (
        <label className="col-span-3 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="col-span-9">
        <Select
          id={name}
          name={name}
          options={options}
          value={value}
          onChange={(selected) => onChange(selected)}
          isDisabled={disabled || isLoading}
          isLoading={isLoading}
          isMulti
          placeholder={`Select ${label || placeholder}`}
          className="text-xs"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
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
              minHeight: "32px",
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              minHeight: "32px",
              padding: "0 4px",
              maxHeight: "300px",
              overflowY: "auto",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }),
            placeholder: (base) => ({
              ...base,
              color: "hsl(0, 0%, 60%)",
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#e0e7ff",
              borderRadius: "4px",
            }),
            indicatorsContainer: (provided, state) => ({
              ...provided,
              minHeight: "32px",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#4f46e5",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#4f46e5",
              ":hover": {
                backgroundColor: "#a5b4fc",
                color: "#fff",
              },
            }),
          }}
        />
      </div>
    </div>
  );
}

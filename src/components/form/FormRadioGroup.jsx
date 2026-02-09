export default function FormRadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required,
  isFlexCol = false,
  isLabelOnTop = false,
  errors = {},
}) {
  return (
    <div
      className={`flex gap-[5px] mb-4 ${
        isLabelOnTop ? "flex-col" : "flex-row"
      }`}
    >
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div>
        <div className={`flex ${isFlexCol ? "flex-col" : "flex-row"} gap-4 `}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`${name}-${option.value}`}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="ml-2 text-sm font-medium text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {errors[name] && (
          <span className="flex justify-start mt-1 text-sm text-red-500">
            {errors[name]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function FormSwitch({
  label,
  name,
  value,
  onChange,
  labelTrue = "Active",
  labelFalse = "Inactive",
  variant = "blue",
}) {
  const colorVariants = {
    blue: {
      active: "bg-blue-600",
      focus: "focus:ring-blue-500",
    },
    red: {
      active: "bg-red-600",
      focus: "focus:ring-red-500",
    },
    yellow: {
      active: "bg-yellow-500",
      focus: "focus:ring-yellow-500",
    },
    green: {
      active: "bg-green-600",
      focus: "focus:ring-green-500",
    },
  };

  const currentVariant = colorVariants[variant] || colorVariants.blue;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="col-span-3 text-xs font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="flex items-center col-span-9 h-[36px]">
        <button
          type="button"
          id={name}
          onClick={() => {
            onChange({
              target: {
                name,
                value: !value,
              },
            });
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            value ? currentVariant.active : "bg-gray-200"
          } ${currentVariant.focus}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="ml-2 text-sm text-gray-700">
          {value ? labelTrue : labelFalse}
        </span>
      </div>
    </div>
  );
}

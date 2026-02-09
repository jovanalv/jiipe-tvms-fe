import { Clock } from "lucide-react";

export default function FormTimePicker({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  min,
  max,
}) {
  return (
    <div className="flex flex-col gap-[5px] mb-4 w-full">
      <label
        htmlFor={name}
        className="col-span-3 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative col-span-9">
        <input
          type="time"
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring"
        />
        {/*   <Clock className="absolute w-5 h-5 text-gray-400 right-3 top-3" /> */}
      </div>
    </div>
  );
}

export default function FormButton({
  label,
  name,
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <div className="flex flex-col gap-[5px] mb-4 w-full">
      <label
        htmlFor={name}
        className="col-span-3 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="col-span-9">
        <button
          id={name}
          name={name}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`h-11 w-full rounded-lg border bg-blue-500 text-white px-4 py-2.5 text-sm shadow-sm hover:bg-blue-600 disabled:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

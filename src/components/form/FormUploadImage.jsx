export default function FormUploadImage({
  label,
  name,
  placeholder,
  onChange,
  required,
  disabled,
  isInvisible,
  errors = {},
  acceptedFileTypes = "image/*",
  previewImage,
  onRemove,
  maxMb,
}) {
  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(e);
  };

  return (
    <div
      className={`flex flex-col gap-[5px] mb-4 w-full ${
        isInvisible ? "opacity-0" : ""
      }`}
    >
      <label
        htmlFor={name}
        className="col-span-3 text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="col-span-9">
        <div className="relative">
          <label
            htmlFor={name}
            className={`block transition-colors duration-200 border-2 border-dashed rounded-md aspect-square ${
              errors[name] ? "border-red-500" : "border-gray-300"
            } ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:border-blue-400 cursor-pointer"
            }`}
            style={{ width: "200px", height: "200px" }}
          >
            {previewImage ? (
              <div className="relative w-full h-full">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-md"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemoveClick}
                    className="absolute p-1 text-white bg-red-500 rounded-full top-[-10px] right-[-10px] hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className="space-y-1 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-12 h-12 mx-auto text-gray-400"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span className="block mt-2 text-sm font-medium text-gray-600">
                      {placeholder || "Click to upload"}
                    </span>
                    <span className="block mt-2 text-xs text-gray-400 font-regular">
                      {`Max file size: ${maxMb} MB`}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              id={name}
              name={name}
              accept={acceptedFileTypes}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className="sr-only"
              aria-describedby={`${name}-description`}
            />
          </label>
        </div>

        {errors[name] && (
          <span className="mt-1 text-sm text-red-500">{errors[name]}</span>
        )}
      </div>
    </div>
  );
}

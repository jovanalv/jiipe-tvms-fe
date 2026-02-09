import * as lucideIcons from "lucide-react";

export default function Button({
  onClick = () => {},
  label,
  labelLoading = "Loading...",
  isLoading,
  type = "button",
  icon,
  disabled,
  variant = "submit",
  size = "medium",
  style,
  isTypeDiv = false,
}) {
  const IconComponent = icon ? lucideIcons[icon] : null;

  const sizeStyles = {
    small: "px-4 py-1.5 text-xs",
    medium: "px-6 py-2 text-sm",
    large: "px-8 py-3 text-base",
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18,
  };

  const spinnerSizes = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  const baseStyle = "font-semibold transition-colors rounded-lg";
  const variantStyles = {
    submit:
      "text-white bg-[#507CFF] disabled:opacity-70",
    submitRed: "text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300",
    outline: "text-gray-700 border border-gray-300 hover:bg-gray-50",
    upload:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 disabled:bg-emerald-300",
    qr: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500 disabled:bg-gray-600",
    doff: "bg-[#313957] hover:bg-gray-900 text-white focus:ring-[#313957] disabled:bg-gray-600",
    approve: "bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300",
    reject:
      "bg-[linear-gradient(115deg,_#DA0000_0%,_#740000_100.1%)] hover:bg-[linear-gradient(115deg,_#b00000_0%,_#5c0000_100%)] transition duration-200 text-white disabled:opacity-70",
  };

  const spinnerBorder =
    variant === "submit" ||
    variant === "submitRed" ||
    variant === "add" ||
    variant === "upload" ||
    variant === "qr" ||
    variant === "doff" ||
    variant === "approve" ||
    variant === "reject"
      ? "border-white"
      : "border-blue-500";

  const content = (
    <>
      {isLoading ? (
        <div className="flex items-center">
          <span
            className={`animate-spin border-2 mr-2 border-t-transparent rounded-full ${spinnerSizes[size]} inline-block ${spinnerBorder}`}
          />
          {labelLoading}
        </div>
      ) : (
        <div className="flex items-center">
          {IconComponent && (
            <IconComponent className="mr-2" size={iconSizes[size]} />
          )}
          {label}
        </div>
      )}
    </>
  );

  return isTypeDiv ? (
    <div
      onClick={disabled || isLoading ? undefined : onClick}
      className={`${baseStyle} ${sizeStyles[size]} ${style} ${
        variantStyles[variant]
      } ${
        disabled || isLoading
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer"
      }`}
    >
      {content}
    </div>
  ) : (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${sizeStyles[size]} ${style} ${variantStyles[variant]}`}
    >
      {content}
    </button>
  );
}

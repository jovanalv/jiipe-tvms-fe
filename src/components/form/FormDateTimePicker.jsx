import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function FormDateTimePicker({
  label,
  name,
  value,
  onChange,
  minDateTime,
  maxDateTime,
  startHour = 7,
  endHour = 17,
  required = false,
  errors,
  defaultHour = "00:00",
  lockToday = false,
  isModal = false,
  isClearable = false,
  noMb = false,
}) {
  const handleChange = (newValue) => {
    if (!newValue) {
      onChange({ target: { name, value: null } });
      return;
    }

    const [defaultH, defaultM] = defaultHour.split(":").map(Number);

    if (newValue.hour() === 0 && newValue.minute() === 0) {
      const newValWithDefault = newValue
        .hour(defaultH)
        .minute(defaultM)
        .second(0);
      onChange({
        target: {
          name,
          value: newValWithDefault.format("YYYY-MM-DDTHH:mm:ss"),
        },
      });
    } else {
      onChange({
        target: { name, value: newValue.format("YYYY-MM-DDTHH:mm:ss") },
      });
    }
  };

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errors[name]) {
      setShowError(true);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errors, name]);

  const shouldDisableDate = (day) => {
    if (!lockToday) return false;
    return !dayjs(day).isSame(dayjs(), "day");
  };

  const handleClear = () => {
    onChange({ target: { name, value: null } });
  };

  return (
    <div className={`w-full ${noMb ? "mb-0" : "mb-4"}`}>
      <label
        className={`block font-medium text-gray-700 input-text-size ${
          isModal ? "" : "mb-1"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            ampm={false}
            format="DD/MM/YYYY HH:mm"
            minDateTime={lockToday ? dayjs().startOf("day") : minDateTime}
            maxDateTime={lockToday ? dayjs().endOf("day") : maxDateTime}
            shouldDisableDate={shouldDisableDate}
            shouldDisableTime={(val, view) => {
              if (view === "hours") {
                return val.hour() < startHour || val.hour() > endHour;
              }
              return false;
            }}
            slotProps={{
              textField: {
                name,
                fullWidth: true,
                variant: "outlined",
                sx: {
                  "& .MuiInputBase-root": {
                    borderRadius: "4px",
                    padding: "0 10px",
                    fontSize: "0.75rem",
                    maxHeight: "32px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    transition: "box-shadow 0.3s ease-in-out",
                    "&.Mui-disabled": {
                      backgroundColor: "#e5e7eb",
                      cursor: "not-allowed",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        errors[name] && showError ? "red" : "#2563eb",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        errors[name] && showError ? "red" : "#2563eb",
                      boxShadow:
                        errors[name] && showError
                          ? "0 0 4px 2px rgba(239, 68, 68, 0.4)"
                          : "0 0 4px 2px rgba(30, 74, 233, 0.2)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "10px 0",
                    margin: "0",
                    "&::placeholder": {
                      color: "#959cb6",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      errors[name] && showError ? "red" : "rgba(0, 0, 0, 0.23)",
                  },
                  "& .MuiIconButton-root": {
                    fontSize: "16px",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "18px",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* Tombol Clear */}
        {value && isClearable && (
          <button
            onClick={handleClear}
            className="absolute top-[2px] right-[29px] text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        )}
        {errors[name] && showError && (
          <span className="absolute bottom-[-17px] left-0 w-full mt-1 text-xs text-red-500">
            {errors[name]}
          </span>
        )}
      </div>
    </div>
  );
}

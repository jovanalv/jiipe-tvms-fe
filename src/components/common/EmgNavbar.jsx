import { useState, useEffect } from "react";
import logo from "../../../public/logo/logo-igas.webp";

export default function EmgNavbar({ area }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const dateString = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid p-3 my-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          {/* Logo */}
          <div>
            <img className="w-[135px] h-full" src={logo} alt="Logo" />
          </div>

          {/* Title */}
          <div>
            <p className="text-2xl font-bold text-[#001F82]">
              EMERGENCY {area} ALARM - ACTIVATED !
            </p>
            <p className="text-base font-normal">UNILEVER HC (Home Care)</p>
          </div>
        </div>

        {/* Time */}
        <div className="text-right ">
          <p className="text-xl font-bold text-gray-800 sm:text-4xl font-akshar">
            {time}
          </p>
          <p className="text-base font-normal">{date}</p>
        </div>
      </div>
    </div>
  );
}

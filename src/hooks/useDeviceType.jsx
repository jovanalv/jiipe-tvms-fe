import { useEffect, useState } from "react";

export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState("PC");

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;

      if (width <= 1280) {
        if (isLandscape) {
          setDeviceType("MOBILE_LANDSCAPE");
        } else {
          setDeviceType("MOBILE_PORTRAIT");
        }
      } else {
        setDeviceType("PC");
      }
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    window.addEventListener("orientationchange", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
      window.removeEventListener("orientationchange", checkDeviceType);
    };
  }, []);

  return deviceType;
}

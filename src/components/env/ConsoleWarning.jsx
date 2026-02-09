import React from "react";

export default function ConsoleWarning() {
  const warningStyle = [
    "font-size: 14px",
    "font-weight: bold",
    "background: #fff3cd",
    "border: 1px solid #ffeeba",
    "color: #856404",
    "padding: 10px",
    "border-radius: 4px",
  ].join(";");

  const showSecurityWarnings = () => {
    if (import.meta.env.MODE !== "production") return;
    console.warn("%c⚠️ SYSTEM SECURITY WARNING!", warningStyle);
    console.warn(
      "🚫 Strictly prohibited to manipulate or edit anything through the browser console"
    );
    console.warn(
      "⚖️ Illegal actions will be subject to sanctions according to applicable policies"
    );
  };

  const setupConsoleClear = () => {
    if (import.meta.env.MODE !== "production") return;

    const originalClear = console.clear;
    console.clear = () => {
      originalClear.call(console);
      showSecurityWarnings();
    };
  };

  React.useEffect(() => {
    showSecurityWarnings();
    setupConsoleClear();
  }, []);

  return null;
}

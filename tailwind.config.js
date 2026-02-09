/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        deng: ["Deng", "sans-serif"],
        akshar: ["Akshar", "sans-serif"],
      },
      screens: {
        "h-600": { raw: "(min-height: 600px)" },
        "h-700": { raw: "(min-height: 700px)" },
        "h-800": { raw: "(min-height: 800px)" },
        "h-900": { raw: "(min-height: 900px)" },
        "h-1000": { raw: "(min-height: 1000px)" },
        "h-1100": { raw: "(min-height: 1100px)" },
        "h-1200": { raw: "(min-height: 1200px)" },
        "h-1300": { raw: "(min-height: 1300px)" },
        "h-1400": { raw: "(min-height: 1400px)" },
        "h-1500": { raw: "(min-height: 1500px)" },
      },
      colors: {
        primary: "#1F36C7",
        grey: "#959CB6",
        text: "#313957",
        dark: "#0C1421",
      },
      boxShadow: {
        sp: "rgba(100, 100, 111, 0.2) 0px 0px 10px 0px",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translate(0, 16px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(0, 0) scale(1)",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
            transform: "translate(0, 0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translate(0, 16px) scale(0.95)",
          },
        },
        overlayShow: {
          "0%": {
            opacity: "0",
            backdropFilter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            backdropFilter: "blur(4px)",
          },
        },
        overlayHide: {
          "0%": {
            opacity: "1",
            backdropFilter: "blur(4px)",
          },
          "100%": {
            opacity: "0",
            backdropFilter: "blur(0)",
          },
        },
        popUpIn: {
          "0%": {
            opacity: "0",
            transform: "translateX(20px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
        },
        popUpOut: {
          "0%": {
            opacity: "1",
            transform: "translateX(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(20px) scale(0.95)",
          },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        zoomOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.7)" },
        },
      },
      animation: {
        modalFadeIn: "fadeIn 0.2s ease-out forwards",
        modalFadeOut: "fadeOut 0.1s ease-out forwards",
        overlayShow: "overlayShow 0.2s ease-out forwards",
        overlayHide: "overlayHide 0.1s ease-out forwards",
        popUpIn: "popUpIn 0.2s ease-out forwards",
        popUpOut: "popUpOut 0.1s ease-out forwards",
        zoomIn: "zoomIn 0.3s ease-out forwards",
        zoomOut: "zoomOut 0.1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

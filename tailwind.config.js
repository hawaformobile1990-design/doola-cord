/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#1565C0",
        accent: "#FF6F00",
        background: "#F5F5F5",
        "background-dark": "#121212",
        foreground: "#FFFFFF",
        "foreground-dark": "#212121",
        error: "#D32F2F",
        success: "#388E3C",
        warning: "#FFA726",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};

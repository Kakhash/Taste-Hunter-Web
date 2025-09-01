/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        th: {
          red: "#FF3B2E",
          mint: "#E6FAFB",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        logo: ["Georgia", "serif"],
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

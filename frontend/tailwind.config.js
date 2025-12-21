/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#121063",
        tahiti: "#3ab7bf",
        secondary: "#0da2e7",
        primary: "#ffc105",
        "primary-text": "0b111e",
      },
    },
  },
  plugins: [],
};

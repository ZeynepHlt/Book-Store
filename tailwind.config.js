/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      screens: {
        lg: "1140px",
        xl: "1140px",
        "2xl": "1140px",
      },
    },
    extend: {
      fontFamily: {
        Play: ["Play", "sans-serif"],
        Mont: ["Montserrat", "sans-serif"],
        Open: ["Open Sans", "sans-serif"],
      },
      colors: {
        lila: "#684096",
        grey: "#F0EEF6",
      },
      spacing: {
        128: "27rem",
      },
    },
  },
  plugins: [],
};

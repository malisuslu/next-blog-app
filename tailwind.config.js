/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  important: "body",
  theme: {
    extend: {},
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "960px",
      // => @media (min-width: 960px) { ... }

      lg: "1440px",
      // => @media (min-width: 1440px) { ... }
    },
  },
  corePlugins: {
    // Remove Tailwind CSS's preflight style so it can use the MUI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [],
};

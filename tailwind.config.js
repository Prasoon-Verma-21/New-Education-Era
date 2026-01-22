/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-navbar': 'calc(100vh - 4rem)', // Custom height calculation
      },
    },
  },
  plugins: [],
};

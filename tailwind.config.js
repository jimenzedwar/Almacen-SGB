const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFFFF',
        },
        secondary: {
          50: '#2C3EFF',
          100: '#DFEEFF',
          200: '#0D1A4A'
        },
        text: {
          50: '#272727',
          100: '#787373',
        },
      },
      fontFamily: {
        Manrope: ["Manrope", 'sans-serif'],
      },
      screens: {
        ssm: '600px'
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    addDynamicIconSelectors({
      includeIconSelector: true,
      includeIconifyClass: true,
    }),],
}


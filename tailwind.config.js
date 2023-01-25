/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('tailwindcss/defaultConfig'), require('xtendui/tailwind.preset'),
  ],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/xtendui/src/*.mjs'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Mulish', ...fontFamily.sans],
      },
      colors: {},
      container: {
        center: true,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    preflight: false,
  },
};

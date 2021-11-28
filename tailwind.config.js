const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime
      },
      cursor: {
        ['ew-resize']: 'ew-resize',
        ['ns-resize']: 'ns-resize',
        ['nwse-resize']: 'nwse-resize',
        ['nesw-resize']: 'nesw-resize'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}

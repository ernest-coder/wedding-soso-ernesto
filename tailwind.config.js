/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const stableScrollbarGutter = plugin(function({addUtilities}) {
  addUtilities({
    '.stable-scrollbar-gutter': {
      'scrollbar-gutter': 'stable',
    },
  })
});

const hideScrollbar = plugin(function({addUtilities}) {
  addUtilities({
    /* Hide scrollbar for Chrome, Safari and Opera */
    ".no-scrollbar::-webkit-scrollbar": {
      "display": "none"
    },
    /* Hide scrollbar for IE, Edge and Firefox */
    ".no-scrollbar": {
      "-ms-overflow-style": "none",  /* IE and Edge */
      "scrollbar-width": "none"  /* Firefox */
    }
  })
})

module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          'dttl-green': '#86BC25',
          'green-4': '#43B02A',
          'green-6': '#046A38',
          'accessible-green': '#26890D',
          'accessible-teal': '#0D8390',
          'accessible-blue': '#007CB0',
          red: '#DA291C',
          orange: '#ED8B00',
          yellow: '#FFCD00',
        },
        secondary: {
          'green-0': '#f9fdf2',
          'green-1': '#E3E48D',
          'green-2': '#C4D600',
          'green-5': '#009A44',
          'green-7': '#2C5234',
          'blue-1': '#A0DCFF',
          'blue-2': '#62B5E5',
          'blue-3': '#00A3E0',
          'blue-4': '#0076A8',
          'blue-5': '#005587',
          'blue-6': '#012169',
          'blue-7': '#041E42',
          'teal-1': '#DDEFE8',
          'teal-2': '#9DD4CF',
          'teal-3': '#6FC2B4',
          'teal-4': '#00ABAB',
          'teal-5': '#0097A9',
          'teal-6': '#007680',
          'teal-7': '#004F59',
          'coolGray-2': '#D0D0CE',
          'coolGray-4': '#BBBCBC',
          'coolGray-6': '#A7A8AA',
          'coolGray-7': '#97999B',
          'coolGray-9': '#75787B',
          'coolGray-10': '#63666A',
          'coolGray-11': '#53565A',
        },
        bright: {
          green: '#0df200',
          teal: '#3efac5',
          blue: '#33f0ff',
        },
      },
    },
  },
  plugins: [stableScrollbarGutter, hideScrollbar],
}


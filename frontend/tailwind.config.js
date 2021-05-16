module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'santander-red': '#ec0000'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#17252A', soft: '#41545B', mute: '#6B7C82' },
        paper: '#F3F5F2',
        line: '#DAE1DD',
        brand: { DEFAULT: '#1F6F68', dark: '#165751', tint: '#E2EFED' },
      },
    },
  },
  plugins: [],
};

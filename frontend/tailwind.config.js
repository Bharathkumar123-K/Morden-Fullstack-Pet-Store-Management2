/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fef3f0', 100: '#fde6dd', 200: '#fbbfac', 300: '#f89979', 400: '#f5713d', 500: '#e85d2f', 600: '#c94a22', 700: '#a33918', 800: '#7d2b12', 900: '#5c1f0d' },
        secondary: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
}

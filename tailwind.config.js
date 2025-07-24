/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#181A20',
        card: '#23262F',
        accentYellow: '#FFE066',
        accentBlue: '#5BC0EB',
        accentPurple: '#A389F4',
        accentGreen: '#6EE7B7',
        accentPink: '#FF6F91',
        accentOrange: '#FFD166',
        textPrimary: '#FFFFFF',
        textSecondary: '#A3A3A3',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};

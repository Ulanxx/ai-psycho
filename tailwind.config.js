/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0A0F1E',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        },
      },
      scale: {
        '102': '1.02',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#E5E7EB',
            code: {
              backgroundColor: '#1F2937',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
              color: '#E5E7EB',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
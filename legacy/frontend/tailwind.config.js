/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF4D85", // Rose Framboise
          dark: "#E63E70",
          light: "#FFA6C1",
        },
        accent: {
          DEFAULT: "#FFB6C1", // Rose poudré
          hover: "#FF9EAD",
        },
        success: "#10B981",
        warning: "#F5A623",
        danger: "#F43F5E",
        background: {
          DEFAULT: "#FEFAFC", // Off-white warmed up
          panel: "#FFFFFF",
        },
        text: {
          primary: "#1C1C1E", // Anthracite
          secondary: "#71717A", // Soft grey
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(255,182,193,0.15)',
        'premium': '0 20px 40px -15px rgba(255,182,193,0.3)',
        'rose-glow': '0 0 0 1px rgba(255,77,133,0.1), 0 8px 24px rgba(255,77,133,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
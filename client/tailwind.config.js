/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "gradient-animation": "gradient-animation 15s ease infinite",
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 25s linear infinite',
      },
      keyframes: {
        "gradient-animation": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      colors: {
        "primary": "#2b4bee",
        "background-light": "#f6f6f8",
        "background-dark": "#101322",
        "card-light": "#ffffff",
        "card-dark": "rgba(255, 255, 255, 0.05)",
        "text-light-primary": "#111218",
        "text-dark-primary": "#ffffff",
        "text-light-secondary": "#616889",
        "text-dark-secondary": "#a9b1d9",
        "border-light": "#f0f1f4",
        "border-dark": "rgba(255, 255, 255, 0.1)"
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
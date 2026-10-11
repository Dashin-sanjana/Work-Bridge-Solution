/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#087BD4",
          deep: "#04549A",
          navy: "#0B2346",
          ink: "#303740",
          mist: "#F2F6FA"
        }
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(11, 35, 70, 0.11)"
      }
    }
  },
  plugins: []
};

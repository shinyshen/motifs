import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Bodoni Moda", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#fdf5f0",
        ink: "#2a1f1f",
        "ink-soft": "#4a3535",
        "warm-gray": "#9a8a8a",
        pink: "#e8a4b8",
        "pink-light": "#f5d0dc",
        "pink-deep": "#c4607a",
        green: "#8faa7c",
        "green-light": "#c4d4b4",
        "green-deep": "#5a7a4a",
        "card-bg": "#fff8f5",
        border: "#e8d0d0",
      },
    },
  },
  plugins: [],
};
export default config;

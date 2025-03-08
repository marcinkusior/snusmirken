import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        customPurple: "#cc66ff",
        customSalmon: "#ffaba1",
      },
      animation: {
        "interval-rotate": "interval-rotate 5s steps(4) infinite", // Customize the duration and steps here
        "spin-slow": "spin 2.8s linear infinite", // Customize the duration here
      },
      keyframes: {
        "interval-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(90deg)" },
          "50%": { transform: "rotate(180deg)" },
          "75%": { transform: "rotate(270deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

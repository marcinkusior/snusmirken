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
        "interval-rotate":
          "interval-rotate 1.4s cubic-bezier(.75,.19,.29,.87) infinite",
        "spin-slow": "spin 2.8s linear infinite", // Customize the duration here
      },
      keyframes: {
        "interval-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

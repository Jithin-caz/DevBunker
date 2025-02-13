import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202326",
        primaryDark:"#242525",
        primaryLight:"#ecf1ef",
        offwhite: "#e3ebf3",
        orange:"#f16661"
      },
    },
  },
  plugins: [],
} satisfies Config;

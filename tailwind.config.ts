import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        custom:
          "-3px -2px 19.8px 0px rgba(31, 28, 70, 0.11), 28px 44px 15px 0px rgba(52, 47, 127, 0.00), 18px 28px 13px 0px rgba(52, 47, 127, 0.01), 10px 16px 11px 0px rgba(52, 47, 127, 0.05), 4px 7px 8px 0px rgba(52, 47, 127, 0.09), 1px 2px 5px 0px rgba(52, 47, 127, 0.10)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;

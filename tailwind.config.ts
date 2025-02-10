import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./public/**/*.svg",
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
      colors: {
        'primary': {
            100: "#D0E7FF",
            200: "#A0C8FF",
            300: "#70A6FF",
            400: "#4A94FF",
            500: "#007BFF",
            600: "#0066CC",
            700: "#00509E",
            800: "#003F7F",
            900: "#002B5C",
        },
      },

    },
  },
  plugins: [],
};
export default config;

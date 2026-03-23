import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#FF8C00',
          skyblue: '#87CEEB',
        },
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // If you're using `next-themes` or toggling dark mode manually
  theme: {
    extend: {
      colors: {
        // primary: {
        //   "100": "#FFF1E6",
        //   "500": "#FF7000",
        // },
        // dark: {
        //   "100": "#000000",
        //   "200": "#0F1117",
        //   "300": "#151821",
        //   "400": "#212734",
        //   "500": "#101012",
        // },
        // light: {
        //   "400": "#858EAD",
        //   "500": "#7B8EC8",
        //   "700": "#DCE3F1",
        //   "800": "#F4F6F8",
        //   "850": "#FDFDFD",
        //   "900": "#FFFFFF",
        // },
        // link: {
        //   "100": "#1DA1F2",
        // },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "auth-dark": 'url("/images/auth-dark.png")',
        "auth-light": 'url("/images/auth-light.png")',
      },
      screens: {
        xs: "420px",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        "space-grotesk": ["var(--font-space-grotesk)"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

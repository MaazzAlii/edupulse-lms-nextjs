import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        surface: "var(--surface)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          tint: "var(--primary-tint)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          tint: "var(--gold-tint)",
        },
        green: {
          DEFAULT: "var(--green)",
          tint: "var(--green-tint)",
        },
        red: {
          DEFAULT: "var(--red)",
          tint: "var(--red-tint)",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Times New Roman", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "IBM Plex Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

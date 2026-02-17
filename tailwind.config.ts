import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    DEFAULT: "#ff0000", // Bright Red to match logo
                    500: "#ff0000",
                    600: "#cc0000",
                    700: "#990000",
                },
                gold: {
                    DEFAULT: "#ff0000", // Aliasing red to gold temporarily to avoid breaking components immediately
                    500: "#ff0000",
                    600: "#cc0000",
                    700: "#990000",
                },
                black: {
                    DEFAULT: "#000000",
                    rich: "#0a0a0a",
                    light: "#171717",
                },
                grey: {
                    dark: "#2a2a2a",
                    light: "#ededed",
                }
            },
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
            }
        },
    },
    plugins: [],
};
export default config;

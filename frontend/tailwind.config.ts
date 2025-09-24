// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: { extend: {} },
    plugins: [],
};

export default config;

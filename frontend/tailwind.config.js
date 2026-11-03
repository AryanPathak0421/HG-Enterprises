import { createRequire } from 'module';

const require = createRequire(import.meta.url);


/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                brand: ["'Baloo 2'", "cursive"],
            },
        },
    },
    plugins: [],
};

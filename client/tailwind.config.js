/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            width: {
                128: '32rem',
                140: '40rem',
                180: '55rem',
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('../public/images/hero.jpg')",
      },
      colors: {
        bgqpay: "#FFFFFF",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        qpayone: "#FF1949",
        mahitwo: "#070052",
        mahithree: "#EC1B24",
        qpaygradient:
          "linear-gradient(90deg, rgba(236,27,36,1) 0%, rgba(249,159,31,1) 35%)",
      },
      fontFamily: {
        bangla: ["Hind Siliguri", "sans-serif"],
        plusjakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
    screens: {
      vxs: "380px",
      xs: "425px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
};

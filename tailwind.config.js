/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/sanring/ui/src/**/*.{html,ts}", // 掃描您的元件
    "./projects/docs/src/**/*.{html,ts}"       // 掃描您的展示頁
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
      },
    },
  },
  plugins: [],
}


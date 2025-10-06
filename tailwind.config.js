/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#c24e0a",
        "background-light": "#f8f6f5",
        "background-dark": "#221710",
        "surface-light": "#efebe9",
        "surface-dark": "#392e28",
        "brand-light": "#943a07",
        "brand-dark": "#e55b0c",
        "text-light": "#1c1917",
        "text-dark": "#e7e5e4",
        "subtle-light": "#a8a29e",
        "subtle-dark": "#a8a29e",
        "accent-light": "#f59e0b",
        "accent-dark": "#f59e0b",
        "info-light": "#dc2626",
        "info-dark": "#ef4444"
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Open Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}

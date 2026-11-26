/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Path design tokens. Keep in sync with src/constants/colors.ts
        ground: "#EEF2F6",
        surface: "#FFFFFF",
        sunk: "#E3E9F0",
        ink: {
          DEFAULT: "#10243E",
          2: "#56677E",
          3: "#8A98AB",
        },
        line: {
          DEFAULT: "#D5DDE7",
          2: "#B8C3D1",
        },
        rose: {
          DEFAULT: "#D6336C",
          soft: "#FBE4EC",
          ink: "#A8204F",
        },
        sun: {
          DEFAULT: "#F5B93A",
          soft: "#FDF0CF",
        },
        danger: {
          DEFAULT: "#B3261E",
          line: "#E9C5C2",
        },
      },
      fontFamily: {
        rh: ["RedHatDisplay_500Medium"],
        "rh-bold": ["RedHatDisplay_700Bold"],
        "rh-black": ["RedHatDisplay_900Black"],
      },
    },
  },
  plugins: [],
}

import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    ringColor: {
      DEFAULT: "#08d69f",
    },
    ringOffsetColor: {
      DEFAULT: "#08d69f",
    },
    extend: {
      fontFamily: {
        // sans: ["var(--font-sans)", ...fontFamily.sans],
        sans: ["Plus Jakarta Sans", ...fontFamily.sans],
        mono: ["Space Mono"],
      },
      colors: {
        step: {
          accent: "#08d69f",
          dimmedAccent: "#003628",
          paper: "#141414",
          dimmedPaper: "#0A0A0A",
          description: "#b2b2b2",
          label: "#7d7d7d",
          disabled: "#3d3d3d",
        },
      },
      // ringColor: {
      //   DEFAULT: "#08d69f",
      // },
      // ringOffsetColor: {
      //   DEFAULT: "#08d69f",
      // },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
} satisfies Config;

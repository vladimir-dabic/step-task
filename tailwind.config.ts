import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        step: {
          accent: "#08d69f",
          paper: "#141414",
          description: "#b2b2b2",
          label: "#7d7d7d",
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
} satisfies Config;

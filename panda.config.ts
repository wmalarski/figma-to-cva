import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import blue from "@park-ui/panda-preset/colors/blue";
import sand from "@park-ui/panda-preset/colors/sand";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({
      accentColor: blue,
      grayColor: sand,
      radius: "md",
    }),
  ],
  include: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  jsxFramework: "solid",
  outdir: "styled-system",
  conditions: {
    extend: {
      dark: '.dark &, [data-theme="dark"] &',
      light: ".light &",
    },
  },
});

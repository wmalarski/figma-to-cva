import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import sand from "@park-ui/panda-preset/colors/sand";
import violet from "@park-ui/panda-preset/colors/violet";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({
      accentColor: violet,
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

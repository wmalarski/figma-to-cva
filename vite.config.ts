import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    solidPlugin(),
    Sonda({ enabled: true, open: false }),
  ],
  build: {
    sourcemap: true,
    target: "esnext",
    rollupOptions: {
      input: ["index.html", "popup.html"],
    },
  },
});

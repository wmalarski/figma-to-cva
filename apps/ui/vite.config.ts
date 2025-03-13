import path from "node:path";
import Sonda from "sonda/vite";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  root: "./src",
  plugins: [
    solidPlugin(),
    viteSingleFile(),
    tsconfigPaths(),
    Sonda({ enabled: true, open: false }),
  ],
  build: {
    minify: mode === "production",
    cssMinify: mode === "production",
    emptyOutDir: false,
    outDir: path.resolve("../../dist"),
    rollupOptions: {
      input: path.resolve("./src/index.html"),
    },
  },
}));

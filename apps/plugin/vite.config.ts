import path from "node:path";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({ mode }) => ({
  plugins: [viteSingleFile()],
  build: {
    minify: mode === "production",
    target: "es2017",
    emptyOutDir: false,
    outDir: path.resolve("../../dist"),
    rollupOptions: {
      input: path.resolve("./src/index.ts"),
      output: {
        entryFileNames: "index.js",
      },
    },
  },
}));

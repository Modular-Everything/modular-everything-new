import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const root = resolve(__dirname, "src/pages");
const outDir = resolve(__dirname, "dist");
const pages = resolve(root, "pages");
const input = {
  main: resolve(root, "index.html"),
  about: resolve(root, "about", "index.html"),
};

export default () => {
  return defineConfig({
    root,
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input,
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src/app", import.meta.url)),
      },
    },
  });
};

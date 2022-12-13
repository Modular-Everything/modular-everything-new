import { defineConfig, loadEnv } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import { fileURLToPath } from "url";
import Sanity from "./src/app/data/sanity/Sanity";

const root = resolve(__dirname, "src/pages");
const outDir = resolve(__dirname, "dist");
const pages = resolve(root, "pages");
const input = {
  main: resolve(root, "index.html"),
  about: resolve(root, "about", "index.html"),
};

export default async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const sanity = new Sanity();
  const pages = await sanity.getPages();

  return defineConfig({
    root,
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input,
      },
    },
    plugins: [
      handlebars({
        context() {
          return {
            ...pages,
          };
        },
        partialDirectory: resolve(__dirname, "src/views"),
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src/app", import.meta.url)),
      },
    },
  });
};

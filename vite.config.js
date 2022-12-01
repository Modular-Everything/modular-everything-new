import handlebars from "vite-plugin-handlebars";
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
    plugins: [
      handlebars({
        context() {
          return {
            title: "Modular Everything",
            projects: [
              {
                title: "Outbreak Fest",
                id: "outbreak-fest",
                active: false,
              },
              {
                title: "DSCVRD Magazine",
                id: "dscvrd-magazine",
                active: false,
              },
              {
                title: "EF Kids & Teens",
                id: "ef-kids-and-teens",
                active: false,
              },
              {
                title: "NRG Experiential",
                id: "nrg",
                active: false,
              },
              {
                title: "Andy Cooke",
                id: "andy-cooke",
                active: false,
              },
            ],
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

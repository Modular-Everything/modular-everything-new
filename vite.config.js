import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default () => {
  return defineConfig({
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src/app", import.meta.url)),
      },
    },
  });
};

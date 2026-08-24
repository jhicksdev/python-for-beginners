import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ command }) => {
  const base = command === "build" ? "/python-for-beginners/" : "/";
  return {
    base,
    plugins: [svelte()],
    server: {
      proxy: {
        "/api": "http://localhost:4568",
      },
    },
    worker: {
      format: "es",
    },
    build: {
      target: "es2022",
    },
  };
});
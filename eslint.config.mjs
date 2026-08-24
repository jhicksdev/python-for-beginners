import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/public/**",
    "**/node_modules/**",
    "**/.vite/**",
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: "python-tutorial",
    rules: {
      // prefer-const false-positives on Svelte `$state` bindings (must be `let`
      // for reactivity) and Bun's deferred module init (reassigned later).
      "prefer-const": "off",
    },
  },
]);
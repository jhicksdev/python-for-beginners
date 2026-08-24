import { copyFile, mkdir } from "node:fs/promises";

// Copies the browser-loadable subset of the pyodide npm package into
// client/public/vendor/pyodide/. The vendor dir is generated (gitignored) —
// never edit or commit it.

const SRC = new URL("../node_modules/pyodide/", import.meta.url);
const DEST = new URL("../public/vendor/pyodide/", import.meta.url);

const FILES = [
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

await mkdir(DEST, { recursive: true });
for (const file of FILES) {
  await copyFile(new URL(file, SRC), new URL(file, DEST));
}
console.log(`copied ${FILES.length} pyodide files to public/vendor/pyodide/`);

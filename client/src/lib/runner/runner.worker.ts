import { HARNESS_SOURCE } from "./harness.py";
import type { CheckResult, RunResult } from "../../../../shared/types";
import type { InlineCheck } from "./wrap";
import { trimBlankLines } from "./wrap";

// Pyodide's loader is imported at runtime, never bundled. In dev it is served
// straight out of node_modules — Vite refuses to serve ESM imports from
// /public through its transform pipeline. In prod, copy-pyodide.ts has placed
// everything under /vendor/pyodide/. The specifier is built at runtime so no
// bundler can statically resolve (and reject) it.
const PYODIDE_DIR = import.meta.env.DEV
  ? ["", "node_modules", "pyodide", ""].join("/")
  : [import.meta.env.BASE_URL.replace(/\/$/, ""), "vendor", "pyodide", ""].join("/");

interface PyodideInterface {
  runPython(code: string): unknown;
  globals: { set(name: string, value: unknown): void };
}

type LoadPyodide = (options: { indexURL?: string }) => Promise<PyodideInterface>;

export interface RunRequest {
  kind: "run";
  id: number;
  code: string;
  checks?: InlineCheck[];
  mustUseMethods?: string[];
  mustUseFunctions?: string[];
}

type OutgoingMessage =
  | { kind: "status"; phase: "loading" | "ready" | "error"; message?: string }
  | { kind: "result"; id: number; result: RunResult };

const post = (msg: OutgoingMessage) => self.postMessage(msg);

let pyodideReady: Promise<void>;
let runExercise:
  | ((src: string, checksJson: string | null, mustUseJson: string | null) => string)
  | undefined;

async function init(): Promise<void> {
  post({ kind: "status", phase: "loading" });

  const mod = (await import(/* @vite-ignore */ `${PYODIDE_DIR}pyodide.mjs`)) as {
    loadPyodide: LoadPyodide;
  };
  const pyodide = await mod.loadPyodide({ indexURL: PYODIDE_DIR });
  pyodide.runPython(HARNESS_SOURCE);

  runExercise = (src: string, checksJson: string | null, mustUseJson: string | null): string => {
    pyodide.globals.set("__tutorial_src", src);
    pyodide.globals.set("__tutorial_checks", checksJson);
    pyodide.globals.set("__tutorial_must_use", mustUseJson);
    return pyodide.runPython(
      "_run_exercise(__tutorial_src, __tutorial_checks, __tutorial_must_use)",
    ) as string;
  };

  post({ kind: "status", phase: "ready" });
}

interface RawCheck {
  name: string;
  ok: boolean;
  got?: string;
  error?: string;
}

function parseChecks(rawChecks: unknown): CheckResult[] | undefined {
  if (rawChecks === null || rawChecks === undefined) return undefined;
  if (!Array.isArray(rawChecks)) return undefined;
  return (rawChecks as RawCheck[]).map((c) => ({
    name: c.name,
    ok: c.ok === true,
    got: c.got,
    error: c.error,
  }));
}

async function execute(
  id: number,
  code: string,
  checks?: InlineCheck[],
  mustUseMethods?: string[],
  mustUseFunctions?: string[],
): Promise<void> {
  let result: RunResult;
  try {
    await pyodideReady;
    const checksJson =
      checks && checks.length > 0
        ? JSON.stringify(checks.map((c) => [c.name, c.expr]))
        : null;
    const mustUseJson =
      mustUseMethods?.length || mustUseFunctions?.length
        ? JSON.stringify({ methods: mustUseMethods, functions: mustUseFunctions })
        : null;

    let raw: string;
    try {
      raw = runExercise!(code, checksJson, mustUseJson);
      const parsed = JSON.parse(raw) as {
        ok: boolean;
        output: string;
        error?: string;
        checks?: RawCheck[];
        methodChecks?: RawCheck[];
      };
      result = {
        ok: parsed.ok,
        output: trimBlankLines(parsed.output),
        error: parsed.error ?? undefined,
        checks: parseChecks(parsed.checks),
        methodChecks: parseChecks(parsed.methodChecks),
      };
    } catch (err) {
      result = {
        ok: false,
        output: "",
        error:
          err instanceof Error
            ? `Something went wrong inside the playground: ${err.message}`
            : "Something went wrong inside the playground.",
      };
    }
  } catch (err) {
    result = {
      ok: false,
      output: "",
      error:
        err instanceof Error
          ? `Python failed to start: ${err.message}`
          : "Python failed to start.",
    };
  }
  post({ kind: "result", id, result });
}

self.onmessage = (event: MessageEvent<RunRequest>) => {
  const msg = event.data;
  if (msg.kind !== "run") return;
  execute(msg.id, msg.code, msg.checks, msg.mustUseMethods, msg.mustUseFunctions).catch(
    () => {},
  );
};

pyodideReady = init().catch((err) => {
  post({
    kind: "status",
    phase: "error",
    message: err instanceof Error ? err.message : String(err),
  });
  throw err;
});

export {};

import { HARNESS_SOURCE } from "../src/lib/runner/harness.py";
import { normalizeOutput } from "../src/lib/runner/wrap";
import { evaluateRun } from "../src/lib/check";
import { chapters } from "../../content/index";

import type { RunResult } from "../../shared/types";

interface RawResult {
  ok: boolean;
  output: string;
  error?: string | null;
}

const PYODIDE_DIR = new URL("../node_modules/pyodide/", import.meta.url).pathname;
const { loadPyodide } = await import(`${PYODIDE_DIR}pyodide.mjs`);
const py = await loadPyodide({ indexURL: PYODIDE_DIR });
py.runPython(HARNESS_SOURCE);

function run(code: string, checks?: [string, string][], mustUseJson?: { methods: string[]; functions: string[] }): RawResult {
  py.globals.set("__tutorial_src", code);
  py.globals.set("__tutorial_checks", checks ? JSON.stringify(checks) : null);
  py.globals.set("__tutorial_must_use", mustUseJson ? JSON.stringify(mustUseJson) : null);
  return JSON.parse(
    py.runPython("_run_exercise(__tutorial_src, __tutorial_checks, __tutorial_must_use)") as string,
  );
}

let total = 0;
let failures = 0;

for (const chapter of chapters) {
  for (const block of chapter.blocks) {
    if (block.type !== "exercise") continue;
    const ex = block;
    total++;
    const pairs =
      ex.check.kind === "assert" ? ex.check.checks.map((c) => [c.name, c.expr]) : undefined;
    const mustUse =
      (ex.mustUseMethods?.length ?? 0) > 0 || (ex.mustUseFunctions?.length ?? 0) > 0
        ? { methods: ex.mustUseMethods ?? [], functions: ex.mustUseFunctions ?? [] }
        : undefined;
    const raw = run(ex.solution ?? "", pairs as [string, string][] | undefined, mustUse);
    const result: RunResult = {
      ok: raw.ok,
      output: raw.output,
      error: raw.error ?? undefined,
      checks: (raw as { checks?: { name: string; ok: boolean; got?: string; error?: string }[] })
        .checks?.map((c) => ({ name: c.name, ok: c.ok === true, got: c.got, error: c.error })),
      methodChecks: (raw as { methodChecks?: { name: string; ok: boolean }[] })
        .methodChecks?.map((c) => ({ name: c.name, ok: c.ok === true })),
    };
    const outcome = evaluateRun(ex, result);
    const tag = `${chapter.slug}/${ex.id}`;
    if (outcome.passed) {
      console.log(`PASS ${tag}`);
    } else {
      failures++;
      console.log(`FAIL ${tag}`);
      console.log(`  ${outcome.failure?.kind}: ${JSON.stringify(outcome.failure?.message)}`);
      if (outcome.failure?.expected)
        console.log(`  expected: ${JSON.stringify(outcome.failure.expected)}`);
      if (outcome.failure?.got !== undefined)
        console.log(`  got:      ${JSON.stringify(outcome.failure.got)}`);
      if (!result.ok) console.log(`  python err: ${result.error}`);
      else console.log(`  raw out:  ${JSON.stringify(normalizeOutput(result.output ?? ""))}`);
    }
  }
}

console.log(`\n${total - failures}/${total} exercise solutions pass their own checks`);
if (failures > 0) process.exit(1);

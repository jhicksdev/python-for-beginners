import { HARNESS_SOURCE } from "../src/lib/runner/harness.py.ts";
import { normalizeOutput } from "../src/lib/runner/wrap.ts";

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

async function scenario(
  label: string,
  code: string,
  checks?: [string, string][],
  mustUseJson?: { methods: string[]; functions: string[] },
): Promise<void> {
  const t0 = performance.now();
  const result = run(code, checks, mustUseJson);
  console.log(`\n=== ${label} === (${Math.round(performance.now() - t0)} ms)`);
  if (!result.ok) {
    console.log("err:", JSON.stringify(result.error));
    if (result.output) console.log("partial output:", JSON.stringify(result.output));
    return;
  }
  console.log("ok | output:", JSON.stringify(normalizeOutput(result.output)));
  for (const c of result.checks ?? []) {
    console.log(`  [${c.ok ? "PASS" : "FAIL"}] ${c.name}`, c.got ?? "", c.error ?? "");
  }
  for (const c of result.methodChecks ?? []) {
    console.log(`  [${c.ok ? "PASS" : "FAIL"}] must call ${c.name}()`);
  }
}

await scenario("hello", `print("Hello!")`);
await scenario("state isolation", `print("leftover" in vars())`);

{
  run(`leftover = "should not leak"`);
  await scenario("after previous define", `print(leftover)`);
}

await scenario("syntax error", `print("oops`);
await scenario("zero division on line 3", `a = 10\nb = 0\nprint(a / b)`);
await scenario("user error with partial output", `print("step one")\nraise ValueError("boom")`);

await scenario(
  "checks all pass",
  `width = 7
height = 3
area = width * height
print(f"Area: {area}")`,
  [
    ["area is 21", "area == 21"],
    ["area is an int", "isinstance(area, int)"],
  ],
);

await scenario(
  "checks mixed results",
  `def greet(name):
    return f"Hi, {name}!"`,
  [
    ["greets Ada", 'greet("Ada") == "Hi, Ada!"'],
    ["wrong expectation", "1 + 1 == 3"],
    ["missing thing", "no_such_thing.anything"],
  ],
);

await scenario(
  "user code crashes before checks",
  `x = 1
y = x.zzz`,
  [["never runs", "True"]],
);

const mustUseJson = { methods: ["upper", "replace"], functions: ["len"] };
await scenario(
  "must-use: requirement satisfied (real calls)",
  `team = "united"
print(len("x"))
print("HELLO".upper().replace("O", "0"))`,
  undefined,
  mustUseJson,
);
await scenario(
  "must-use: workaround rejected (no real call)",
  `print("UNITED!")`,
  undefined,
  mustUseJson,
);
await scenario(
  "must-use: string literal does NOT count",
  `print('upper')`,
  undefined,
  { methods: ["upper"] },
);

console.log("\nALL SMOKE TESTS DONE");

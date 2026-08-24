import type { CheckResult, Exercise, RunResult } from "../../../shared/types";
import { normalizeOutput } from "./runner/wrap";

export interface CheckOutcome {
  passed: boolean;
  failure?: {
    kind: "error" | "timeout" | "output" | "assert" | "method";
    message: string;
    expected?: string;
    got?: string;
  };
}

function matchesOutput(
  mode: "exact" | "contains" | "regex" | undefined,
  expected: string,
  got: string,
): boolean {
  if (mode === "regex") {
    try {
      return new RegExp(expected).test(got);
    } catch {
      return false;
    }
  }
  if (mode === "contains") return got.includes(normalizeOutput(expected));
  return got === normalizeOutput(expected);
}

export function evaluateRun(exercise: Exercise, result: RunResult): CheckOutcome {
  if (result.timedOut) {
    return { passed: false, failure: { kind: "timeout", message: result.error ?? "Timed out." } };
  }
  if (!result.ok) {
    return { passed: false, failure: { kind: "error", message: result.error ?? "Your code raised an error." } };
  }

  const check = exercise.check;

  if (check.kind === "output") {
    const got = normalizeOutput(result.output);
    const passed = matchesOutput(check.mode, check.expect, got);
    if (passed) return outputMethodOutcome(exercise, result);
    const expectedForDisplay = check.mode === "regex" ? check.displayExpect : check.expect;
    return {
      passed: false,
      failure: {
        kind: "output",
        message:
          check.mode === "regex"
            ? "Not quite. Your output didn't have the form we asked for."
            : "That's not the exact output this exercise asks for.",
        expected: expectedForDisplay,
        got: result.output,
      },
    };
  }

  if (check.kind === "assert") {
    const checks = result.checks ?? [];
    const failed = checks.filter((c) => !c.ok);
    if (failed.length === 0 && checks.length > 0) return assertMethodOutcome(exercise, result);

    const lines = failed.map((c) =>
      c.error ? `${c.name}: ${c.error}` : `${c.name}${c.got !== undefined ? ` (got ${c.got})` : ""}`,
    );
    const hint = check.failHint ? `\n\n${check.failHint}` : "";
    return {
      passed: false,
      failure: {
        kind: "assert",
        message: failed.length === checks.length && checks.length > 0
          ? `None of the checks passed.${hint}`
          : `Not quite. ${checks.length - failed.length} of ${checks.length} checks passed.${hint}`,
        expected: lines.join("\n"),
      },
    };
  }

  return { passed: true };
}

/** After an output check passes, require method usage if declared. */
function outputMethodOutcome(exercise: Exercise, result: RunResult): CheckOutcome {
  if (!needsMethodCheck(exercise)) return { passed: true };
  const methodChecks = result.methodChecks ?? [];
  const methodFailed = methodChecks.filter((c) => !c.ok);
  if (methodFailed.length === 0) return { passed: true };
  return methodFailure(methodFailed);
}

/** After an assert check passes, require method usage if declared. */
function assertMethodOutcome(exercise: Exercise, result: RunResult): CheckOutcome {
  if (!needsMethodCheck(exercise)) return { passed: true };
  const methodChecks = result.methodChecks ?? [];
  const methodFailed = methodChecks.filter((c) => !c.ok);
  if (methodFailed.length === 0) return { passed: true };
  return methodFailure(methodFailed);
}

function needsMethodCheck(exercise: Exercise): boolean {
  return (exercise.mustUseMethods?.length ?? 0) > 0 || (exercise.mustUseFunctions?.length ?? 0) > 0;
}

function methodFailure(methodFailed: CheckResult[]): CheckOutcome {
  return {
    passed: false,
    failure: {
      kind: "method",
      message:
        "Your output is right, but you must use the technique this exercise is teaching.\n" +
        methodFailed.map((c) => `You must call ${c.name}()`).join("\n"),
      expected: methodFailed.map((c) => `call ${c.name}()`).join("\n"),
    },
  };
}

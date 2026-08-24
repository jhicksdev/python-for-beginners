import { writable } from "svelte/store";
import type { AssertionCheck, RunResult } from "../../../../shared/types";

export type RunnerPhase = "idle" | "loading" | "ready" | "error";

export const runnerPhase = writable<RunnerPhase>("idle");
export const runnerError = writable<string | undefined>(undefined);

interface PendingRequest {
  resolve: (result: RunResult) => void;
  timer: ReturnType<typeof setTimeout>;
}

const DEFAULT_TIMEOUT_MS = 8000;

class WorkerRunner {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, PendingRequest>();
  private warmRequested = false;

  private spawn(): Worker {
    const worker = new Worker(new URL("./runner.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.kind === "status") {
        runnerPhase.set(msg.phase);
        runnerError.set(msg.message);
        return;
      }
      if (msg.kind === "result") {
        const pending = this.pending.get(msg.id);
        if (!pending) return;
        clearTimeout(pending.timer);
        this.pending.delete(msg.id);
        pending.resolve(msg.result as RunResult);
      }
    };
    worker.onerror = () => {
      runnerPhase.set("error");
      runnerError.set("The code runner crashed. Try again in a moment.");
      this.worker = null;
      this.failRemaining();
    };
    return worker;
  }

  private ensureWorker(): Worker {
    if (!this.worker) this.worker = this.spawn();
    return this.worker;
  }

  run(
    code: string,
    checks?: AssertionCheck[],
    timeoutMs = DEFAULT_TIMEOUT_MS,
    mustUseMethods?: string[],
    mustUseFunctions?: string[],
  ): Promise<RunResult> {
    const worker = this.ensureWorker();
    const id = this.nextId++;
    // Svelte 5 $state proxies are not structured-cloneable — send plain copies
    const plainChecks = checks
      ? checks.map((c) => ({ name: c.name, expr: c.expr }))
      : undefined;
    return new Promise<RunResult>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        this.worker?.terminate();
        this.worker = null;
        this.failRemaining();
        resolve({
          ok: false,
          output: "",
          timedOut: true,
          error:
            "Your code ran for too long. Is there a loop that never ends? The playground was reset.",
        });
      }, timeoutMs);
      this.pending.set(id, { resolve, timer });
      worker.postMessage({
        kind: "run",
        id,
        code,
        checks: plainChecks,
        mustUseMethods,
        mustUseFunctions,
      });
    });
  }

  private failRemaining() {
    for (const [, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.resolve({ ok: false, output: "", error: "Runner restarted." });
    }
    this.pending.clear();
  }

  warmUp() {
    if (this.warmRequested) return;
    this.warmRequested = true;
    this.ensureWorker();
  }
}

let singleton: WorkerRunner | undefined;

export function getPythonRunner(): WorkerRunner {
  if (!singleton) singleton = new WorkerRunner();
  return singleton;
}

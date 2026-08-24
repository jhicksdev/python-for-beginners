<script lang="ts">
  import { marked } from "marked";
  import type { Exercise, RunResult } from "../../../../shared/types";
  import { getPythonRunner, runnerPhase } from "../runner/client";
  import { evaluateRun, type CheckOutcome } from "../check";
  import { isComplete, markComplete } from "../progress.svelte";
  import CodeEditor from "./CodeEditor.svelte";
  import OutputPanel from "./OutputPanel.svelte";

  interface Props {
    exercise: Exercise;
    onSolved?: () => void;
  }

  let { exercise, onSolved }: Props = $props();

  const runner = getPythonRunner();

  let code = $state(exercise.starter);
  let result = $state<RunResult | null>(null);
  let outcome = $state<CheckOutcome | null>(null);
  let running = $state(false);
  let showHint = $state(false);
  let showSolution = $state(false);

  let solvedLocally = $state(isComplete(exercise.id));
  const solved = $derived(solvedLocally || isComplete(exercise.id));
  const promptHtml = $derived(marked.parse(exercise.prompt, { async: false }) as string);

  const mustUse = $derived.by(() => {
    const methods = (exercise.mustUseMethods ?? []).map((m) => `.${m}()`);
    const functions = (exercise.mustUseFunctions ?? []).map((f) => `${f}()`);
    return [...methods, ...functions];
  });

  async function runAndCheck() {
    if (running) return;
    running = true;
    result = null;
    outcome = null;
    const check = exercise.check;
    const res = await runner.run(
      code,
      check.kind === "assert" ? check.checks : undefined,
      undefined,
      exercise.mustUseMethods,
      exercise.mustUseFunctions,
    );
    result = res;
    outcome = evaluateRun(exercise, res);
    if (outcome.passed) {
      solvedLocally = true;
      markComplete(exercise.id);
      onSolved?.();
    }
    running = false;
  }

  function useSolution() {
    code = exercise.solution ?? "";
    showSolution = false;
  }

  const expectedPanel = $derived.by(() => {
    if (!outcome?.failure) return undefined;
    if (outcome.failure.kind === "output" && outcome.failure.expected !== undefined) {
      const isRegex = exercise.check.kind === "output" && exercise.check.mode === "regex";
      return {
        label: isRegex ? "Should look something like this:" : "Expected output",
        body: outcome.failure.expected,
      };
    }
    return undefined;
  });
</script>

<section class="exercise" class:solved>
  <header>
    <span class="cell" class:on={solved} aria-hidden="true"></span>
    <div class="heading">
      <span class="comment-tag">your turn, python</span>
      <h3>{exercise.title}</h3>
      {#if mustUse.length > 0}
        <span class="must-chip" title="Your code must call these">
          must use: {mustUse.join(" ")}
        </span>
      {/if}
    </div>
    {#if solved}
      <span class="pill">✓ solved</span>
    {/if}
  </header>

  <div class="prompt">
    {@html promptHtml}
  </div>

  <div class="editor-frame">
    <CodeEditor bind:value={code} onsubmit={runAndCheck} />
  </div>

  <div class="actions">
    <button
      class="primary"
      type="button"
      onclick={runAndCheck}
      disabled={running || $runnerPhase === "error"}
    >
      {running ? "Checking…" : solved ? "Run again" : "Run & check"}
      <kbd>⌘⏎</kbd>
    </button>
    {#if exercise.hint}
      <button
        class="secondary"
        type="button"
        onclick={() => (showHint = !showHint)}
        aria-expanded={showHint}
      >
        {showHint ? "Hide hint" : "Hint"}
      </button>
    {/if}
    {#if exercise.solution && !solved}
      <button
        class="secondary"
        type="button"
        onclick={() => (showSolution = !showSolution)}
        aria-expanded={showSolution}
      >
        {showSolution ? "Hide solution" : "Show solution"}
      </button>
    {/if}
    {#if exercise.solution && solved}
      <button class="secondary" type="button" onclick={useSolution}>Load solution</button>
    {/if}
  </div>

  {#if showHint && exercise.hint}
    <p class="hint"><strong>Hint:</strong> {exercise.hint}</p>
  {/if}

  {#if showSolution && exercise.solution}
    <details class="solution" open>
      <summary>One way to do it</summary>
      <pre>{exercise.solution}</pre>
      <button class="secondary small" type="button" onclick={useSolution}>
        Copy into editor
      </button>
    </details>
  {/if}

  <OutputPanel {result} {running} expected={expectedPanel} />

  {#if outcome?.passed && exercise.successMessage}
    <p class="success">{exercise.successMessage}</p>
  {:else if outcome?.passed}
    <p class="success">Solved. That one's in the books.</p>
  {:else if outcome?.failure}
    <p class="try-again">
      {#if outcome.failure.kind === "timeout"}
        {outcome.failure.message}
      {:else if outcome.failure.kind === "error"}
        Fix the error above and run again.
      {:else if outcome.failure.kind === "method"}
        <span class="method-msg">{outcome.failure.message}</span>
      {:else}
        Not there yet. Adjust your code and run again.
      {/if}
    </p>
  {/if}
</section>

<style>
  .exercise {
    border: 1px solid var(--border-strong);
    border-radius: 0;
    background: var(--surface);
    overflow: hidden;
    margin: 36px 0;
  }
  .exercise.solved:not(:has(.panel.error)) {
    border-color: color-mix(in srgb, var(--green) 35%, var(--border));
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px 0;
  }
  .cell {
    width: 16px;
    height: 16px;
    background: var(--border-strong);
    border-radius: 5px;
    flex-shrink: 0;
    transition: background var(--speed) ease, box-shadow var(--speed) ease;
  }
  .cell.on {
    background: var(--accent);
    box-shadow: 0 0 0 5px var(--accent-tint);
  }
  .heading {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px 8px;
  }
  .must-chip {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.04em;
    color: var(--accent);
    background: var(--accent-tint);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    padding: 2px 8px;
    border-radius: 2px;
    white-space: nowrap;
  }
  .comment-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.06em;
    color: var(--ink-3);
  }
  .comment-tag::before {
    content: "# ";
    color: var(--accent);
  }
  h3 {
    margin: 2px 0 0;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 19px;
    letter-spacing: -0.01em;
  }
  .pill {
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--green);
    border: 1px solid color-mix(in srgb, var(--green) 40%, transparent);
    padding: 3px 9px;
    border-radius: 2px;
    background: var(--green-tint);
  }
  .prompt {
    padding: 4px 16px 12px 46px;
    font-size: 14.5px;
    color: var(--ink-2);
  }
  .prompt :global(p) {
    margin: 6px 0;
  }
  .prompt :global(code) {
    font-family: var(--font-mono);
    font-size: 12.5px;
    background: var(--surface-2);
    border: 1px solid var(--code-border);
    padding: 1px 5px;
    border-radius: 5px;
  }
  .prompt :global(pre code) {
    display: block;
    padding: 10px 12px;
    background: var(--code-bg);
    overflow-x: auto;
  }
  .editor-frame {
    margin: 0 16px;
    border: 1px solid var(--code-border);
    border-radius: 8px;
    background: var(--code-bg);
    overflow: hidden;
    position: relative;
  }
  .editor-frame::after {
    content: ">>>";
    position: absolute;
    right: 10px;
    bottom: 6px;
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--ink-3);
    opacity: 0.14;
    pointer-events: none;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding: 12px 16px;
  }
  button.primary,
  button.secondary {
    font-family: var(--font-mono);
    font-size: 13px;
    padding: 7px 15px;
    border-radius: 3px;
    cursor: pointer;
    transition: color var(--speed) ease, background var(--speed) ease, border-color var(--speed) ease;
  }
  button.primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: var(--on-accent);
    box-shadow: 0 1px 4px color-mix(in srgb, var(--accent) 18%, transparent);
  }
  button.primary:hover:not(:disabled) {
    background: var(--accent-deep);
    border-color: var(--accent-deep);
  }
  button.primary:disabled {
    opacity: 0.55;
    cursor: default;
  }
  button.primary kbd {
    font-size: 11px;
    opacity: 0.6;
  }
  button.secondary {
    border: 1px solid var(--border-strong);
    background: transparent;
    color: var(--ink-2);
  }
  button.secondary:hover {
    color: var(--accent);
    border-color: var(--accent-tint);
    background: transparent;
  }
  button.secondary.small {
    font-size: 12px;
    padding: 4px 10px;
  }
  .hint {
    margin: 0;
    padding: 10px 16px 12px 46px;
    font-size: 13.5px;
    color: var(--ink-2);
    background: var(--amber-tint);
    border-top: 1px solid var(--border);
  }
  .solution {
    margin: 0 16px 4px 46px;
    font-size: 13.5px;
  }
  .solution summary {
    cursor: pointer;
    color: var(--ink-2);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .solution pre {
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-radius: 0;
    padding: 12px 14px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    overflow-x: auto;
  }
  .success {
    margin: 0;
    padding: 10px 16px 14px 46px;
    font-size: 13.5px;
    color: var(--green);
    background: var(--green-tint);
    animation: pop 220ms ease;
  }
  @keyframes pop {
    0% { opacity: 0; transform: translateY(3px); }
    100% { opacity: 1; transform: none; }
  }
  .try-again {
    margin: 0;
    padding: 10px 16px 14px 46px;
    font-size: 13.5px;
    color: var(--ink-2);
    border-top: 1px solid var(--border);
    background: var(--surface-2);
  }
  .method-msg {
    white-space: pre-line;
    color: var(--error);
  }
</style>

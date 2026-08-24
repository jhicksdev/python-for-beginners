<script lang="ts">
  import type { ExampleBlock as ExampleBlockType, RunResult } from "../../../../shared/types";
  import { getPythonRunner, runnerPhase } from "../runner/client";
  import CodeEditor from "./CodeEditor.svelte";
  import OutputPanel from "./OutputPanel.svelte";

  interface Props {
    block: ExampleBlockType;
  }

  let { block }: Props = $props();

  const runner = getPythonRunner();

  let code = $state(block.code);
  let initialCode = block.code;
  let result = $state<RunResult | null>(null);
  let running = $state(false);

  async function run() {
    if (running) return;
    running = true;
    result = null;
    result = await runner.run(code);
    running = false;
  }

  function reset() {
    code = initialCode;
    result = null;
  }
</script>

<section class="example">
  <div class="tag-row">
    <span class="comment-tag">try it</span>
    {#if block.title}<span class="title">{block.title}</span>{/if}
    <button class="ghost" type="button" onclick={reset} disabled={code === initialCode}>reset</button>
  </div>

  <div class="editor-frame">
    <CodeEditor bind:value={code} onsubmit={run} />
  </div>

  <div class="run-row">
    <button
      class="run"
      type="button"
      onclick={run}
      disabled={running || $runnerPhase === "error"}
    >
      {running ? "Running…" : "Run"}
      <kbd>⌘⏎</kbd>
    </button>
    <span class="run-hint">outputs appear below →</span>
  </div>

  <OutputPanel {result} {running} />

  {#if block.note}
    <p class="note">{block.note}</p>
  {/if}
</section>

<style>
  .example {
    border: 1px solid var(--border);
    border-radius: 0;
    background: var(--surface);
    overflow: hidden;
    margin: 24px 0;
    box-shadow: none;
  }
  .tag-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--code-border);
    background: var(--surface-2);
  }
  .comment-tag {
    font-family: var(--font-mono);
    font-size: 11.5px;
    letter-spacing: 0.04em;
    color: var(--ink-3);
    white-space: nowrap;
  }
  .comment-tag::before {
    content: "# ";
    color: var(--accent);
    font-weight: 700;
  }
  .title {
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 650;
    color: var(--ink-2);
    flex: 1;
    letter-spacing: -0.01em;
  }
  .ghost {
    border: 1px solid transparent;
    background: none;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    cursor: pointer;
    padding: 4px 10px;
    border-radius: 0;
    transition: color var(--speed) ease, background var(--speed) ease, border-color var(--speed) ease;
  }
  .ghost:hover:not(:disabled) {
    color: var(--ink);
    background: var(--surface-2);
    border-color: var(--border);
  }
  .ghost:disabled { visibility: hidden; }
  .editor-frame {
    background: var(--code-bg);
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
    opacity: 0.16;
    pointer-events: none;
  }
  .run-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-top: 1px solid var(--code-border);
    border-bottom: 1px solid var(--code-border);
    background: var(--surface);
  }
  .run {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 12.5px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: var(--accent-tint);
    color: var(--accent-deep);
    cursor: pointer;
    transition: color var(--speed) ease, background var(--speed) ease, border-color var(--speed) ease;
  }
  .run:hover:not(:disabled) {
    background: var(--accent);
    color: var(--on-accent);
    border-color: var(--accent);
  }
  .run:disabled { opacity: 0.55; cursor: default; }
  .run kbd { font-family: inherit; font-size: 11px; opacity: 0.55; }
  .run-hint { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }
  .note {
    margin: 0;
    padding: 11px 14px 13px;
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ink-2);
    background: var(--surface-2);
    border-top: 1px solid var(--border);
  }
</style>

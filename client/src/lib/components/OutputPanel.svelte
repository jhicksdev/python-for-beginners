<script lang="ts">
  import type { RunResult } from "../../../../shared/types";
  import { runnerPhase } from "../runner/client";

  interface Props {
    result: RunResult | null;
    running: boolean;
    expected?: { label: string; body: string };
  }

  let { result, running, expected }: Props = $props();

  const warming = $derived(running && $runnerPhase === "loading");
</script>

{#if running}
  <div class="panel running" role="status">
    <span class="spinner" aria-hidden="true"></span>
    {warming ? "Warming up Python — this happens once…" : "Running…"}
  </div>
{:else if result}
  <div class="panel" class:error={!result.ok && !result.timedOut} class:timeout={result.timedOut}>
    {#if result.output.trim().length > 0}
      <pre class="output">{result.output}</pre>
    {:else if result.ok}
      <pre class="output muted">(no output)</pre>
    {/if}

    {#if result.error}
      <pre class="error-msg">{result.error}</pre>
    {/if}

    {#if expected}
      <div class="expected">
        <div class="expected-label">{expected.label}</div>
        <pre>{expected.body}</pre>
        {#if result.output.trim().length > 0}
          <div class="expected-label">Your output</div>
          <pre>{result.output}</pre>
        {/if}
      </div>
    {/if}

    {#if result.checks}
      <ul class="checks">
        {#each result.checks as check (check.name)}
          <li class={check.ok ? "pass" : "fail"}>
            <span class="glyph" aria-hidden="true">{check.ok ? "✓" : "✗"}</span>
            <span class="check-name">{check.name}</span>
            {#if check.got !== undefined}<span class="detail">{check.got}</span>{/if}
            {#if check.error}<span class="detail err">{check.error}</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}

    {#if result.methodChecks}
      <ul class="checks must">
        {#each result.methodChecks as check (check.name)}
          <li class={check.ok ? "pass" : "fail"}>
            <span class="glyph" aria-hidden="true">{check.ok ? "✓" : "✗"}</span>
            <span class="check-name">must call {check.name}()</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style>
  .panel {
    border-top: 1px solid var(--code-border);
    background: var(--code-bg);
    padding: 12px 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    animation: reveal 180ms ease;
  }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(-2px); }
    to { opacity: 1; transform: none; }
  }
  .running {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ink-2);
  }
  .spinner {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--accent-tint);
    border-top-color: var(--accent);
    animation: spin 700ms linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .panel.error {
    border-top-color: color-mix(in srgb, var(--accent) 35%, var(--code-border));
    background: color-mix(in srgb, var(--accent-tint) 40%, var(--code-bg));
  }
  .panel.timeout {
    border-top-color: color-mix(in srgb, var(--amber) 45%, var(--code-border));
    background: var(--amber-tint);
  }
  .output {
    margin: 0;
    white-space: pre-wrap;
    color: var(--ink);
  }
  .output.muted {
    color: var(--ink-3);
  }
  .error-msg {
    margin: 8px 0 0;
    white-space: pre-wrap;
    color: var(--accent-deep);
  }
  .expected {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed var(--border-strong);
  }
  .expected-label {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-bottom: 4px;
  }
  .expected pre {
    margin: 0 0 8px;
    white-space: pre-wrap;
    color: var(--ink-2);
  }
  .checks {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .checks li {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }
  .checks li.pass .glyph { color: var(--green); }
  .checks li.fail .glyph { color: var(--accent-deep); }
  .check-name { color: var(--ink); }
  .detail { color: var(--ink-3); }
  .detail.err { color: var(--ink-2); }
  .checks.must {
    margin-top: 6px;
    border-top: 1px dashed var(--border-strong);
    padding-top: 8px;
  }
  .checks.must .check-name {
    color: var(--ink-2);
    font-family: var(--font-mono);
    font-size: 11.5px;
  }
</style>

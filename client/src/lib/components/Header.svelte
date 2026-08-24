<script lang="ts">
  import type { ChapterSummary } from "../../../../shared/types";
  import { getProgress, resetProgress, totalCompleted } from "../progress.svelte";
  import { theme } from "../theme.svelte";
  import { goHome } from "../router";

  interface Props {
    summaries: ChapterSummary[] | null;
    onMenuClick: () => void;
  }

  let { summaries, onMenuClick }: Props = $props();

  let confirmingReset = $state(false);

  const totalExercises = $derived(
    summaries?.reduce((sum, c) => sum + c.exerciseIds.length, 0) ?? 0,
  );
  const completed = $derived(getProgress() ? totalCompleted() : 0);
  const pct = $derived(totalExercises > 0 ? Math.round((completed / totalExercises) * 100) : 0);

  function toggleTheme() {
    theme.update((t) => (t === "light" ? "dark" : "light"));
  }

  function doReset() {
    if (!confirmingReset) {
      confirmingReset = true;
      setTimeout(() => (confirmingReset = false), 4000);
      return;
    }
    resetProgress();
    confirmingReset = false;
  }
</script>

<header>
  <button class="menu" type="button" onclick={onMenuClick} aria-label="Toggle chapter list">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </button>

  <a
    class="brand"
    href="#/"
    onclick={(e) => {
      e.preventDefault();
      goHome();
    }}
  >
    <span class="prompt-mark" aria-hidden="true">&gt;&gt;&gt;</span>
    <span class="brand-text">Python for Beginners</span>
  </a>

  <div class="progress-wrap" title="{completed} of {totalExercises} exercises solved">
    <div class="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div class="fill" style:width="{pct}%"></div>
    </div>
    <span class="pct">{pct}%</span>
  </div>

  <button class="icon-btn has-tooltip" type="button" onclick={doReset} aria-label={confirmingReset ? "Confirm reset. Click again to clear all completed exercises" : "Reset progress"} data-tooltip={confirmingReset ? "Click again to confirm. This clears all completed exercises" : "Reset progress"} aria-pressed={confirmingReset}>
    {#if confirmingReset}
      <span class="confirm-text">Confirm reset?</span>
    {:else}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 4.5h10l-.8 8.2a1.5 1.5 0 0 1-1.5 1.3H5.3a1.5 1.5 0 0 1-1.5-1.3L3 4.5Zm2.5-.5V3a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 10.5 3v1M2 4.5h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    {/if}
  </button>

  <button class="icon-btn has-tooltip" type="button" onclick={toggleTheme} aria-label="Toggle dark mode" data-tooltip={$theme === "dark" ? "Light mode" : "Dark mode"}>
    {#if $theme === "dark"}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="3.2" stroke="currentColor" stroke-width="1.4" />
        <path d="M8 .9v1.9M8 13.2v1.9M.9 8h1.9M13.2 8h1.9M2.9 2.9l1.3 1.3M11.8 11.8l1.3 1.3M13.1 2.9l-1.3 1.3M4.2 11.8l-1.3 1.3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    {:else}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13.5 9.7A6 6 0 0 1 6.3 2.5a6 6 0 1 0 7.2 7.2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
      </svg>
    {/if}
  </button>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 16px;
    height: var(--header-h);
    padding: 0 24px;
    background: var(--bg);
    border-bottom: 1px solid var(--border-strong);
  }
  header::after {
    display: none;
  }
  .menu {
    display: none;
    border: none;
    background: none;
    color: var(--ink-2);
    cursor: pointer;
    padding: 6px;
  }
  .brand {
    position: static;
    transform: none;
    display: flex;
    align-items: baseline;
    gap: 7px;
    text-decoration: none;
    color: var(--ink);
  }
  .prompt-mark {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -0.08em;
    color: var(--accent);
    transform: translateY(-1px);
    display: inline-block;
  }
  .brand-text {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  .progress-wrap {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 160px;
    max-width: 260px;
    flex: 1;
  }
  .bar {
    flex: 1;
    height: 4px;
    border-radius: 0;
    background: var(--surface-2);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--accent);
    border-radius: 0;
    transition: width 400ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .pct {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--ink-2);
    min-width: 34px;
    text-align: right;
  }
  .icon-btn {
    border: 1px solid transparent;
    background: none;
    color: var(--ink-2);
    cursor: pointer;
    padding: 7px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    transition: color var(--speed) var(--ease-out), background var(--speed) var(--ease-out), border-color var(--speed) var(--ease-out);
  }
  .icon-btn:hover {
    color: var(--ink);
    background: var(--surface-2);
  }
  .confirm-text {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-tint);
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    padding: 3px 8px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .icon-btn[aria-pressed="true"] {
    background: var(--accent-tint);
    border-color: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--accent);
  }
  .has-tooltip {
    position: relative;
  }
  .has-tooltip[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 10px;
    font-family: var(--font-mono);
    font-size: 11.5px;
    line-height: 1.3;
    color: var(--ink);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 7px;
    max-width: 200px;
    white-space: normal;
    overflow-wrap: break-word;
    pointer-events: none;
    opacity: 0;
     transition: opacity 150ms var(--ease-out);
    z-index: 30;
  }
  .has-tooltip[data-tooltip]:hover::after {
    opacity: 1;
  }
  @media (max-width: 900px) {
    .menu {
      display: inline-flex;
    }
    .brand { margin-right: auto; }
  }
  @media (max-width: 480px) {
    .brand-text {
      display: none;
    }
    .progress-wrap {
      max-width: none;
    }
  }
</style>

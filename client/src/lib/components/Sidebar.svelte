<script lang="ts">
  import type { ChapterSummary } from "../../../../shared/types";
  import { chapterCompletion, getProgress } from "../progress.svelte";
  import { navigate } from "../router";

  interface Props {
    summaries: ChapterSummary[] | null;
    currentSlug: string | null;
    onNavigate?: () => void;
  }

  let { summaries, currentSlug, onNavigate }: Props = $props();

  function go(slug: string) {
    navigate(slug);
    onNavigate?.();
  }

  const progressState = $derived(getProgress());

  function doneCount(summary: ChapterSummary): number {
    return chapterCompletion(summary.exerciseIds);
  }
</script>

{#if !summaries}
  <div class="loading">Loading chapters…</div>
{:else}
  <ol>
    {#each summaries as summary (summary.slug)}
      {@const done = doneCount(summary)}
      {@const total = summary.exerciseIds.length}
      {@const complete = total > 0 && progressState && done === total}
      <li>
        <a
          href="#/{summary.slug}"
          class:current={currentSlug === summary.slug}
          onclick={(e) => {
            e.preventDefault();
            go(summary.slug);
          }}
        >
          <span class="cell" class:on={complete} aria-hidden="true"></span>
          <span class="meta">
            <span class="num">{String(summary.number).padStart(2, "0")}</span>
            <span class="title">{summary.title}</span>
            {#if total > 0}
              <span class="count">{done}/{total}</span>
            {/if}
          </span>
        </a>
      </li>
    {/each}
  </ol>
{/if}

<style>
  .loading {
    padding: 20px;
    color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 12.5px;
  }
  ol {
    list-style: none;
    margin: 14px 0;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--ink);
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    border-left: 2px solid transparent;
    transition: background var(--speed) ease, border-color var(--speed) ease;
  }
  a:hover {
    background: var(--surface-2);
  }
  a.current {
    background: var(--accent-tint);
    border-left-color: var(--accent);
  }
  a.current .title {
    color: var(--accent-deep);
    font-weight: 650;
  }
  .cell {
    width: 10px;
    height: 10px;
    background: var(--border-strong);
    border-radius: 3px;
    flex-shrink: 0;
    transition: background var(--speed) ease, box-shadow var(--speed) ease;
    margin-left: 2px;
  }
  .cell.on {
    background: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-tint);
  }
  .meta {
    display: flex;
    align-items: baseline;
    gap: 7px;
    min-width: 0;
  }
  .num {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .count {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
  }
</style>

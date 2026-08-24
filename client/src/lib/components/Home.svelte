<script lang="ts">
  import type { ChapterSummary } from "../../../../shared/types";
  import { navigate, lastChapter } from "../router";
  import { chapterCompletion, getProgress } from "../progress.svelte";
  import { getPythonRunner, runnerPhase } from "../runner/client";
  import type { RunResult } from "../../../../shared/types";
  import CodeEditor from "./CodeEditor.svelte";

  interface Props {
    summaries: ChapterSummary[] | null;
  }

  let { summaries }: Props = $props();

  const resumeSlug = $derived.by(() => {
    if (!summaries || summaries.length === 0) return null;
    const last = lastChapter();
    if (last && summaries.some((s) => s.slug === last)) {
      const summary = summaries.find((s) => s.slug === last)!;
      const done = chapterCompletion(summary.exerciseIds);
      if (summary.exerciseIds.length === 0 || done < summary.exerciseIds.length) return last;
    }
    for (const summary of summaries) {
      const done = chapterCompletion(summary.exerciseIds);
      if (done < summary.exerciseIds.length) return summary.slug;
    }
    return null;
  });

  function start() {
    navigate(resumeSlug ?? summaries?.[0]?.slug ?? "");
  }

  const progressState = $derived(getProgress());

  // hero live REPL
  const runner = getPythonRunner();
  let heroCode = $state(`print("Hello, Python!")\nname = "you"\nprint(f"Happy to meet {name} -> {2 + 2}")`);
  let heroResult = $state<RunResult | null>(null);
  let heroRunning = $state(false);

  async function runHero() {
    if (heroRunning) return;
    heroRunning = true;
    heroResult = null;
    heroResult = await runner.run(heroCode);
    heroRunning = false;
  }
</script>

<div class="home">
  <div class="hero">
    <div class="hero-copy">
      <span class="comment-tag"># welcome — &gt;&gt;&gt;</span>
      <h1>Learn Python,<br /><span class="accent-word">one small win</span> at a time.</h1>
      <p class="lede">
        Real Python runs right in your browser — no setup, no installs.
        Read a little, write a little, and watch the computer do what you told it to.
      </p>
      <div class="cta-row">
        <button class="start" type="button" onclick={start}>
          {resumeSlug ? "Continue learning →" : "Start chapter one →"}
        </button>
        <span class="hint-line">
          {#if summaries}
            {@const total = summaries.reduce((sum, c) => sum + c.exerciseIds.length, 0)}
            {total} exercises · {summaries.length} chapters · saves in this browser
          {:else}
            11 chapters · saves in this browser
          {/if}
        </span>
      </div>
      <div class="hero-meta">
        <span class="meta-pill"><i class="facet on"></i> solved cell</span>
        <span class="meta-pill"><i class="facet"></i> next up</span>
        <span class="meta-rule">beginner · friendly · in-browser</span>
      </div>
    </div>

    <div class="hero-repl">
      <div class="repl-chrome">
        <span class="chrome-dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="chrome-title">python — 3.14</span>
        <span class="chrome-tag">live</span>
      </div>
      <div class="repl-editor">
        <CodeEditor bind:value={heroCode} onsubmit={runHero} />
      </div>
      <div class="repl-actions">
        <button class="repl-run" type="button" onclick={runHero} disabled={heroRunning || $runnerPhase === "error"}>
          {heroRunning ? "Running…" : "Run"} <kbd>⌘⏎</kbd>
        </button>
        <span class="repl-hint">Try changing the name.</span>
      </div>
      <div class="repl-output" class:has-output={!!heroResult}>
        {#if heroRunning}
          <span class="repl-spin" aria-hidden="true"></span> Running…
        {:else if heroResult}
          {#if heroResult.output.trim()}
            <pre>{heroResult.output}</pre>
          {:else if heroResult.ok}
            <pre class="muted">(no output — try a print)</pre>
          {/if}
          {#if heroResult.error}
            <pre class="err">{heroResult.error}</pre>
          {/if}
        {:else}
          <pre class="muted">Click Run to see what Python prints —</pre>
        {/if}
      </div>
      <div class="repl-watermark" aria-hidden="true">&gt;&gt;&gt;</div>
    </div>
  </div>

  {#if summaries}
    <div class="section-head">
      <span class="eyebrow">the path</span>
      <span class="eyebrow-line"></span>
      <span class="eyebrow count">{summaries.length} chapters — in order</span>
    </div>
    <ol class="preview">
      {#each summaries as s (s.slug)}
        {@const done = chapterCompletion(s.exerciseIds)}
        {@const complete = done === s.exerciseIds.length && s.exerciseIds.length > 0}
        {@const progress = s.exerciseIds.length ? Math.round((Math.max(done,0)/s.exerciseIds.length)*100) : 0}
        <li>
          <a href="#/{s.slug}" class:done={complete}>
            <span class="n">{String(s.number).padStart(2, "0")}</span>
            <span class="facet" class:on={complete} aria-hidden="true"></span>
            <span class="t">{s.title}</span>
            <em>{s.tagline}</em>
            {#if s.exerciseIds.length > 0}
              <span class="count">{Math.max(done,0)}/{s.exerciseIds.length}</span>
            {/if}
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .home {
    max-width: 1080px;
    width: 100%;
    padding-top: clamp(28px, 5vh, 56px);
  }
  .hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(24px, 4vw, 48px);
    align-items: start;
    padding-bottom: 42px;
    border-bottom: 1px solid var(--border);
  }
  .comment-tag {
    font-family: var(--font-mono);
    font-size: 12.5px;
    letter-spacing: 0.04em;
    color: var(--ink-3);
  }
  .comment-tag::before {
    content: "# ";
    color: var(--accent);
    font-weight: 700;
  }
  h1 {
    font-family: var(--font-display);
    font-variation-settings: "opsz" 32;
    font-size: clamp(40px, 6.2vw, 62px);
    font-weight: 650;
    letter-spacing: -0.032em;
    line-height: 0.95;
    margin: 14px 0 16px;
  }
  .accent-word {
    font-style: italic;
    font-weight: 500;
    color: var(--accent);
    letter-spacing: -0.03em;
  }
  .lede {
    font-size: 17.5px;
    line-height: 1.55;
    color: var(--ink-2);
    max-width: 520px;
    margin: 0 0 26px;
    font-weight: 400;
  }
  .cta-row {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .start {
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #fff;
    background: var(--accent);
    border: 1px solid var(--accent);
    padding: 12px 22px;
    border-radius: 999px;
    cursor: pointer;
    transition: transform var(--speed) ease, background var(--speed) ease, border-color var(--speed) ease, box-shadow var(--speed) ease;
    box-shadow: 0 2px 12px color-mix(in srgb, var(--accent) 22%, transparent);
  }
  .start:hover {
    background: var(--accent-deep);
    border-color: var(--accent-deep);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 28%, transparent);
  }
  .hint-line {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    letter-spacing: 0.02em;
  }
  .hero-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    border: 1px solid var(--border);
    background: var(--surface);
    padding: 4px 10px;
    border-radius: 999px;
  }
  .meta-rule {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-left: 2px;
  }
  .facet {
    width: 10px;
    height: 10px;
    background: var(--border-strong);
    border-radius: 3px;
    display: inline-block;
    flex-shrink: 0;
    transition: background var(--speed) ease, transform var(--speed) ease;
  }
  .facet.on {
    background: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-tint);
  }

  /* hero REPL card */
  .hero-repl {
    position: relative;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface);
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(24, 28, 38, 0.08), 0 1px 3px rgba(24, 28, 38, 0.06);
  }
  .repl-chrome {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%);
  }
  .chrome-dots { display: flex; gap: 6px; }
  .chrome-dots i {
    width: 9px; height: 9px; border-radius: 50%; display: block;
  }
  .chrome-dots i:nth-child(1){background:#FF5F56; border:1px solid #E0443E}
  .chrome-dots i:nth-child(2){background:#FFBD2E; border:1px solid #DEA123}
  .chrome-dots i:nth-child(3){background:#27C93F; border:1px solid #1AAB29}
  :global([data-theme="dark"]) .chrome-dots i{opacity:0.9}
  .chrome-title {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    letter-spacing: 0.02em;
  }
  .chrome-tag {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-tint);
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    padding: 2px 7px;
    border-radius: 999px;
  }
  .repl-editor {
    background: var(--code-bg);
    border-bottom: 1px solid var(--code-border);
    overflow: hidden;
    position: relative;
  }
  .repl-editor::after {
    content: ">>>";
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ink-3);
    opacity: 0.18;
    pointer-events: none;
    letter-spacing: 0.04em;
  }
  .repl-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--surface);
  }
  .repl-run {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: #fff;
    cursor: pointer;
    transition: all var(--speed) ease;
  }
  .repl-run:hover:not(:disabled){ background: var(--accent-deep); border-color: var(--accent-deep); }
  .repl-run:disabled{ opacity:0.5; cursor: default;}
  .repl-run kbd{ font-size: 11px; opacity:0.65; }
  .repl-hint{ font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }
  .repl-output {
    min-height: 72px;
    padding: 12px 14px;
    background: var(--code-bg);
    border-top: 1px solid var(--code-border);
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.6;
    color: var(--ink);
    position: relative;
    overflow: hidden;
  }
  .repl-output pre{ margin:0; white-space: pre-wrap; }
  .repl-output .muted{ color: var(--ink-3); font-style: italic; }
  .repl-output .err{ color: var(--accent-deep); margin-top: 6px; }
  .repl-spin{
    width:10px; height:10px; border-radius:50%; border:2px solid var(--accent-tint); border-top-color: var(--accent);
    display:inline-block; animation: spin 700ms linear infinite; vertical-align: middle;
  }
  @keyframes spin{ to{transform:rotate(360deg)}}
  .repl-watermark{
    position: absolute;
    right: -6px;
    bottom: -6px;
    font-family: var(--font-display);
    font-size: 96px;
    line-height: 1;
    color: var(--accent);
    opacity: 0.06;
    font-style: italic;
    pointer-events: none;
    user-select: none;
  }

  .section-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 38px 0 18px;
  }
  .eyebrow{
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-3);
  }
  .eyebrow-line{ flex:1; height:1px; background: var(--border); }
  .eyebrow.count{ color: var(--ink-2); letter-spacing: 0.06em;}
  .preview {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--surface);
  }
  .preview li + li{ border-top: 1px solid var(--border); }
  .preview a {
    display: grid;
    grid-template-columns: 36px 14px 1fr auto auto;
    align-items: center;
    column-gap: 10px;
    text-decoration: none;
    color: var(--ink);
    padding: 14px 14px 14px 12px;
    transition: background var(--speed) ease;
    position: relative;
  }
  .preview a:hover { background: var(--surface-2); }
  .preview a.done .facet{ background: var(--accent); box-shadow: 0 0 0 4px var(--accent-tint); }
  .n {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--ink-3);
    font-weight: 500;
  }
  .preview a .t {
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -0.01em;
  }
  em {
    font-style: normal;
    font-size: 13px;
    color: var(--ink-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 4px;
  }
  .count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    background: var(--surface-2);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: 999px;
    margin-left: 6px;
  }
  .done .count{ color: var(--accent); border-color: var(--accent-tint); background: var(--accent-tint); }
  .arrow{ font-size: 14px; color: var(--ink-3); margin-left: 2px; transition: transform var(--speed) ease, color var(--speed) ease; }
  .preview a:hover .arrow{ transform: translateX(2px); color: var(--accent); }

  @media (max-width: 900px) {
    .hero{ grid-template-columns: 1fr; }
    h1{ font-size: clamp(36px, 9vw, 52px); }
    .repl-watermark{ font-size: 72px; }
  }
  @media (max-width: 560px) {
    .preview a {
      grid-template-columns: 30px 12px 1fr auto;
      padding: 12px 10px;
    }
    em{ display: none; }
    .arrow{ display:none; }
  }
</style>

<script lang="ts">
  import type { Chapter, ChapterSummary } from "../../../../shared/types";
  import { loadChapter } from "../chapters.svelte";
  import { navigate, rememberChapter } from "../router";
  import ProseBlock from "./ProseBlock.svelte";
  import ExampleBlock from "./ExampleBlock.svelte";
  import ExerciseCard from "./ExerciseCard.svelte";

  interface Props {
    slug: string;
    summaries: ChapterSummary[] | null;
  }

  let { slug, summaries }: Props = $props();

  let chapter = $state<Chapter | null>(null);
  let error = $state<string | null>(null);
  let loadId = 0;

  async function load(slugValue: string) {
    const id = ++loadId;
    chapter = null;
    error = null;
    try {
      const loaded = await loadChapter(slugValue);
      if (id !== loadId) return;
      chapter = loaded;
      rememberChapter(slugValue);
    } catch (err) {
      if (id !== loadId) return;
      error = err instanceof Error ? err.message : "Could not load this chapter.";
    }
  }

  $effect(() => {
    void load(slug);
    window.scrollTo({ top: 0 });
  });

  const index = $derived(summaries?.findIndex((c) => c.slug === slug) ?? -1);
  const prev = $derived(index > 0 ? summaries?.[index - 1] : undefined);
  const next = $derived(
    summaries && index >= 0 && index < summaries.length - 1 ? summaries[index + 1] : undefined,
  );

  const paddedNumber = $derived(
    chapter ? String(chapter.number).padStart(2, "0") : "",
  );
</script>

{#if error}
  <div class="error-state">
    <span class="comment-tag">oops</span>
    <p>{error}</p>
    <button type="button" onclick={() => load(slug)}>Try again</button>
  </div>
{:else if !chapter}
  <div class="loading" role="status">Loading chapter…</div>
{:else}
  <article>
    <header class="chapter-head">
      <div class="chapter-meta">
        <span class="cell" aria-hidden="true"></span>
        <span class="comment-tag big"># chapter {paddedNumber} with {chapter.blocks.filter(b=>b.type==="exercise").length} exercises</span>
      </div>
      <h1>{chapter.title}</h1>
      <p class="tagline">{chapter.tagline}</p>
    </header>

    {#each chapter.blocks as block, i (`${slug}-${i}`)}
      {#if block.type === "prose"}
        <ProseBlock block={block} />
      {:else if block.type === "example"}
        <ExampleBlock block={block} />
      {:else if block.type === "exercise"}
        <ExerciseCard exercise={block} />
        {#if block.type === "exercise" && i < chapter.blocks.length - 1 && chapter.blocks[i+1].type !== "exercise"}
          <div class="arrow-divider" aria-hidden="true"><span>-&gt;</span></div>
        {/if}
      {/if}
    {/each}

    <nav class="pager">
      {#if prev}
        <a
          class="prev"
          href="#/{prev.slug}"
          onclick={(e) => {
            e.preventDefault();
            navigate(prev.slug);
          }}
        >
          <span>← Chapter {String(prev.number).padStart(2, "0")}</span>
          <strong>{prev.title}</strong>
        </a>
      {:else}
        <span></span>
      {/if}
      {#if next}
        <a
          class="next"
          href="#/{next.slug}"
          onclick={(e) => {
            e.preventDefault();
            navigate(next.slug);
          }}
        >
          <span>Chapter {String(next.number).padStart(2, "0")} →</span>
          <strong>{next.title}</strong>
        </a>
      {:else}
        <div class="finale">
        <span class="comment-tag">the end</span>
          <p>You've reached the last chapter. Go build something!</p>
        </div>
      {/if}
    </nav>
  </article>
{/if}

<style>
  article,
  .error-state,
  .loading {
    max-width: 740px;
    width: 100%;
  }
  .chapter-head {
    margin: 48px 0 28px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-strong);
  }
  .chapter-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .cell {
    width: 10px; height: 10px;
    background: var(--accent);
    border-radius: 1px;
    box-shadow: 0 0 0 4px var(--accent-tint);
  }
  h1 {
    font-family: var(--font-display);
    font-variation-settings: "opsz" 32;
    font-size: clamp(30px, 5vw, 42px);
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.05;
    margin: 0 0 8px;
  }
  .tagline {
    margin: 0;
    color: var(--ink-2);
    font-size: 16.5px;
    line-height: 1.5;
    font-weight: 400;
  }
  .comment-tag {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-3);
    letter-spacing: 0.03em;
  }
  .comment-tag::before {
    content: "# ";
    color: var(--accent);
    font-weight: 700;
  }
  .comment-tag.big { font-size: 12px; letter-spacing: 0.06em; }
  .arrow-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 6px 0;
    color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    opacity: 0.7;
  }
  .arrow-divider::before, .arrow-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .arrow-divider span {
    color: var(--accent);
    font-size: 13px;
    letter-spacing: 0;
  }
  .error-state { margin-top: 60px; }
  .error-state button {
    font-family: var(--font-mono);
    border: 1px solid var(--border-strong);
    background: var(--surface);
    padding: 6px 14px;
    border-radius: 999px;
    cursor: pointer;
    color: var(--ink-2);
  }
  .loading {
    margin-top: 60px;
    color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 13px;
  }
  .pager {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
    margin: 48px 0 80px;
  }
  .pager a {
    text-decoration: none;
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 14px 18px;
    min-width: 180px;
    transition: border-color var(--speed) ease, background var(--speed) ease, transform var(--speed) ease;
    background: transparent;
  }
  .pager a span {
    display: block;
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--ink-3);
    margin-bottom: 3px;
  }
  .pager a strong {
    font-weight: 650;
    font-size: 14.5px;
    color: var(--ink);
    font-family: var(--font-body);
  }
  .pager a:hover {
    border-color: var(--accent);
    background: var(--accent-tint);
    transform: translateX(3px);
  }
  .pager a.next { text-align: right; margin-left: auto; }
  .finale {
    text-align: right;
    color: var(--ink-2);
    font-size: 14px;
    border: 1px dashed var(--border);
    padding: 14px 18px;
    border-radius: var(--radius);
    background: var(--surface-2);
  }
  @media (max-width: 560px) {
    .pager { flex-direction: column-reverse; }
    .pager a.next { text-align: left; }
  }
</style>

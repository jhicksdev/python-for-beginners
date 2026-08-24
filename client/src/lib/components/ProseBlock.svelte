<script lang="ts">
  import { marked } from "marked";
  import type { ProseBlock as ProseBlockType } from "../../../../shared/types";

  interface Props {
    block: ProseBlockType;
  }

  let { block }: Props = $props();

  const html = $derived(marked.parse(block.md, { async: false }));
</script>

<div class="prose">
  {@html html}
</div>

<style>
  .prose {
    margin: 18px 0;
    font-size: 16.5px;
    color: var(--ink);
    font-family: var(--font-body);
  }
  .prose :global(p) {
    margin: 14px 0;
  }
  .prose :global(h2),
  .prose :global(h3) {
    font-family: var(--font-display);
    letter-spacing: -0.01em;
    margin: 30px 0 8px;
  }
  .prose :global(h2) {
    font-size: 24px;
  }
  .prose :global(h3) {
    font-size: 19px;
  }
  .prose :global(a) {
    color: var(--ink-2);
  }
  .prose :global(strong) {
    font-weight: 650;
  }
  .prose :global(code) {
    font-family: var(--font-mono);
    font-size: 0.82em;
    background: var(--surface-2);
    border: 1px solid var(--code-border);
    border-radius: 5px;
    padding: 1.5px 5px;
    color: var(--tok-keyword);
  }
  :global([data-theme="dark"]) .prose :global(code) {
    color: var(--tok-keyword);
  }
  .prose :global(pre) {
    background: var(--code-bg);
    border: 1px solid var(--code-border);
    border-radius: 8px;
    padding: 12px 14px;
    overflow-x: auto;
  }
  .prose :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink);
  }
  .prose :global(ul) {
    padding-left: 22px;
  }
  .prose :global(li) {
    margin: 6px 0;
  }
  .prose :global(li::marker) {
    color: var(--ink-2);
  }
  .prose :global(blockquote) {
    margin: 16px 0;
    padding: 8px 18px;
    border-left: 3px solid var(--accent);
    background: var(--accent-tint);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    color: var(--ink-2);
    font-style: italic;
  }
</style>

<script lang="ts">
  import { chapterList } from "./lib/chapters.svelte";
  import { currentSlug } from "./lib/router";
  import { getPythonRunner } from "./lib/runner/client";
  import Header from "./lib/components/Header.svelte";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import Home from "./lib/components/Home.svelte";
  import ChapterView from "./lib/components/ChapterView.svelte";

  let menuOpen = $state(false);
  const slug = $derived($currentSlug);
  const summaries = $derived($chapterList);

  $effect(() => {
    document.title = "Python for Beginners. Learn to code in your browser";
  });

  $effect(() => {
    const runner = getPythonRunner();
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => runner.warmUp(), { timeout: 3000 });
    } else {
      setTimeout(() => runner.warmUp(), 1500);
    }
  });
</script>

<div class="shell">
  <Header {summaries} onMenuClick={() => (menuOpen = !menuOpen)} />

  <a class="skip-link" href="#main-content">Skip to content</a>

  <div class="body">
    <aside class:open={menuOpen}>
      <Sidebar
        {summaries}
        currentSlug={slug}
        onNavigate={() => (menuOpen = false)}
      />
      <p class="sidebar-foot">
        Runs real Python via WebAssembly. Your progress is saved in this browser.
      </p>
    </aside>

    {#if menuOpen}
      <div
        class="scrim"
        role="presentation"
        onclick={() => (menuOpen = false)}
      ></div>
    {/if}

    <main id="main-content" tabindex="-1">
      {#if slug}
        <ChapterView {slug} summaries={summaries} />
      {:else}
        <Home {summaries} />
      {/if}
    </main>
  </div>
</div>

<style>
  .shell {
    min-height: 100vh;
  }
  .skip-link {
    position: fixed;
    z-index: 50;
    top: 8px;
    left: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--on-accent);
    font-family: var(--font-mono);
    font-size: 12px;
    text-decoration: none;
    transform: translateY(-160%);
    transition: transform var(--speed) var(--ease-out);
  }
  .skip-link:focus-visible {
    transform: translateY(0);
  }
  .body {
    display: flex;
    align-items: flex-start;
  }
  aside {
    position: sticky;
    top: var(--header-h);
    width: var(--sidebar-w);
    flex-shrink: 0;
    height: calc(100vh - var(--header-h));
    overflow-y: auto;
    border-right: 1px solid var(--border-strong);
    padding: 24px 0 20px;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }
  .sidebar-foot {
    margin: auto 20px 0;
    padding-top: 18px;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--ink-2);
    border-top: 1px solid var(--border);
  }
  main {
    flex: 1;
    min-width: 0;
    padding: 0 clamp(20px, 5vw, 88px) 32px;
    display: flex;
    justify-content: center;
  }
  .scrim {
    display: none;
  }
  @media (max-width: 900px) {
    aside {
      position: fixed;
      z-index: 30;
      transform: translateX(-100%);
      transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: none;
    }
    aside.open {
      transform: none;
      box-shadow: var(--shadow-card);
    }
    .scrim {
      display: block;
      position: fixed;
      inset: var(--header-h) 0 0;
      z-index: 25;
      background: color-mix(in oklch, var(--ink) 28%, transparent);
    }
  }
</style>

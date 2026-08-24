# Python Tutorial UI Design

## Design Philosophy

This design rejects templated AI defaults in favor of a visual identity grounded in Python's own world: **the `>>>` prompt, the code cell, and the REPL**. The interface makes deliberate, opinionated choices that feel specific to Python's philosophy — *readability counts*, playfulness welcome (Monty Python is in the name) — not a generic warm-cream tutorial.

The signature is the **prompt chevrons + code cell + `>>>` watermark** — Python's vernacular made tactile. The accent is azure blue (`--accent: #1D63B8`) — interpreter-blue, not default-framework blue, and appears strategically at interaction moments. The hero is a thesis: a live REPL you can run before you read a word.

## Color Token System (6 named hex values)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `--bg` | `#FFFBF2` | `#12141A` | Washi paper (peach-warm) / deep ink-black |
| `--ink` | `#1F1A1C` | `#EDF2FC` | Warm near-black; not pure black |
| `--accent` | `#1D63B8` | `#7CB7EE` | Azure blue — deep water, not tailwind #3B82F6 |
| `--accent-tint` | `#E1EDFB` | `#14212F` | Current row, cell glow, focus wash |
| `--border` | `#E7D8C4` | `#272B35` | Washi edge |
| `--ink-3` | `#958A86` | `#8B93A4` | Secondary, gutters, dividers |

Additional: `--surface: #FFFFFF / #191C24`, `--surface-2: #F3EAE0 / #20232C`, `--green: #0F766E / #34D399` (solved), `--code-bg: #FFF8F0 / #16181F`. Code blocks carry a faint `>>>` watermark (opacity 0.14–0.18) rather than a flat fill.

### Accent Usage Map

- **Focus outlines** (`:focus-visible`) — azure, single intentional place
- **Primary CTA + REPL Run** — pill buttons with soft shadow, not square
- **Current chapter in Sidebar** (`a.current`) — tint + azure left border + cell glow (`box-shadow: 0 0 0 4px var(--accent-tint)`)
- **Cell** (`.cell.on`, `.facet.on`) — filled azure when chapter/exercise complete
- **NOT used**: sidebar hover, neutral borders, code chrome (these stay washi/gray)

## Type Scale

| Role | Font | Notes |
|------|------|-------|
| **Display** | `Fraunces Variable` opsz 32, 650–700, `letter-spacing: -0.028` to `-0.032` | Used with restraint: hero + chapter H1 only. Italic on `one small win` for emphasis. |
| **Body** | `Space Grotesk` 400/500/700, tracking -0.01em, 16px/1.65 | Geometric humanist, playful + technical; replaces generic Inter. More distinctive, matching Python's friendly-but-serious character. |
| **Mono** | `IBM Plex Mono` 400/500 | Code, prompts, numbers, pills, captions. `11–13px`, uppercase pills at `0.06–0.14em` tracking. |

## Layout & Structure

### Signature Treatment: Prompt Chevrons + Cell + `>>>` Watermark

- **Prompt mark**: `>>>` set in IBM Plex Mono bold, accent-colored — the brand glyph in the header and hero comment tag. Not an image.
- **Cell**: small rounded square (`.cell`, `.facet`) — the "block of code" made physical. Used in Sidebar, hero meta, Chapter head, Exercise header. Glows with `box-shadow: 0 0 0 4px var(--accent-tint)` when complete.
- **Arrow**: `->` appears as watermark in hero REPL (`96px Fraunces italic, 0.06 opacity`) and as `arrow-divider` (`— -> —` with 1px rules) between exercise → prose transitions. Every editor frame carries a faux prompt `>>>` (`position: absolute; right:10px; bottom:6px`).
- **Hero thesis**: Two-column (`1.05fr / 0.95fr`) above 900px, stacked below. Left: headline/lede/CTA/meta pills. Right: live REPL card with traffic-light dots, `python — 3.14` chrome, editable CodeMirror + Run → output. Most characteristic thing in Python's world (the interactive interpreter) is the first thing you see.

### Content Flow

- **Home**: Max-width 1080px. Hero with live demo (thesis). Below: `the path` eyebrow + rule + chapter lattice — bordered card list with `36px` number / `14px` cell / title / tagline / pill count / `→` hover. Cell turns azure when chapter complete.
- **Chapter pages**: Head with `cell + # chapter 02 — 3 exercises`, H1 in Fraunces 700/42px, tagline. Blocks: prose → example (with `->` divider) → exercise. Pager at bottom is pill-bordered with hover tint + lift.
- **Exercise**: Card with bordered header, cell, `pill ✓ solved` in green, editor-frame with `>>>` watermark, pill primary (`999px`) + secondary outline pills.

## Motion & Interaction

- **Subtle only**: `160ms ease` on color/border/transform; `400ms cubic-bezier(0.22,1,0.36,1)` on progress fill.
- **Success pop**: `220ms` translate + fade on `.success`.
- **Cell glow**: `box-shadow` spread when `.on` (no scale) — quiet discipline.
- **Reduced motion**: single `prefers-reduced-motion` block kills all anims.
- **No scroll reveals** or ambient particles — one orchestrated moment (hero REPL) lands harder than scattered effects.

## Written Copy Decisions

- **Home headline**: `Learn Python, one small win at a time.` — `one small win` italic + azure, emphasizes incremental progress.
- **Hero lede**: `Real Python runs right in your browser — no setup, no installs.` — what the person controls.
- **Hero REPL**: `print("Hello, Python!")` starter + hint `Try changing the name.` — invites play in 2 seconds.
- **Chapter tagline**: e.g. `Say hello and make your computer talk back` — plain, active.
- **Errors**: `Fix the error above and run again.` — direct, no apology.
- **Success**: `Solved. That one's in the books.` — conversational, consistent.

## Why These Choices

- Python's world is textual and interactive: the `>>>` prompt, indented blocks, the REPL loop — not abstract shapes. The design pulls from those instruments.
- Interpreter blue `#1D63B8` instead of framework blue or Ruby red; washi paper `#FFFBF2` keeps the tutorial warm while the accent stays cool and precise.
- Fraunces' soft serifs match Python's approachability; Space Grotesk's tight geometry matches the interpreter's precision.

**The aesthetic risk**: **putting a live, runnable Python REPL in the hero** above the fold. Risk: heavier hero, competes with headline, could fail if wasm loads slowly, pushes chapter list down. Justification: for a language tutorial, the most honest thesis is not words about Python but Python itself responding to you. It turns the page from brochure into instrument — and failure is graceful (shows `(no output — try a print)` / warming state).

## Token Reference

```css
/* Light */
--bg: #FFFBF2;
--ink: #1F1A1C;
--accent: #1D63B8;
--accent-deep: #164C87;
--accent-tint: #E1EDFB;
--border: #E7D8C4;
--surface: #FFFFFF;
--surface-2: #F3EAE0;
--font-display: "Fraunces Variable", Georgia, serif;
--font-body: "Space Grotesk", system-ui, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, monospace;

/* Dark */
--bg: #12141A;
--ink: #EDF2FC;
--accent: #7CB7EE;
--accent-deep: #A6CCF4;
--accent-tint: #14212F;
--border: #272B35;
```

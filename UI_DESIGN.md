# Python Tutorial UI Design

## Current Direction

The interface is an editorial workbench for beginners learning by running
small pieces of Python. It should feel like a focused reading and practice
space, not a generic SaaS dashboard. The visual reference is Python's textual
world: the REPL, the code cell, indentation, and a printed index.

The redesign keeps the useful Python-specific details but removes their
decorative repetition. `>>>` is reserved for the brand and code context. Cells
are completion markers, not a general-purpose icon. Arrows are used only when
they clarify movement through the lesson. Status and actions are deliberately
different from one another.

## Design Principles

- Make the lesson content the strongest visual element.
- Use one clear accent for focus, primary actions, and completion.
- Prefer rules, whitespace, and typography over nested cards and shadows.
- Keep the live editor visible and runnable without fake browser or IDE chrome.
- Make errors specific and calm; do not use the accent color for failures.
- Never invent metrics, testimonials, or product claims.
- Keep all color, font, radius, and motion values in named tokens.

## Token System

The source of truth is `client/src/tokens.css`. The root `tokens.css` file
imports it as a portable entrypoint. `client/src/app.css` maps the token names
to semantic variables used by the components.

| Token group | Role |
| --- | --- |
| `--color-paper`, `--color-paper-2`, `--color-paper-3` | Warm reading surfaces and code-adjacent surfaces |
| `--color-ink`, `--color-ink-2`, `--color-ink-3` | Primary, secondary, and muted text |
| `--color-accent`, `--color-accent-deep`, `--color-accent-tint` | Interpreter blue for focus and meaningful interaction |
| `--color-positive`, `--color-positive-tint` | Solved exercises and successful runs |
| `--color-warning`, `--color-warning-tint` | Hints and timeouts |
| `--color-error`, `--color-error-tint` | Tracebacks and failed checks |
| `--color-code` and `--color-rule*` | Editors, output, and separators |

The theme is controlled by `:root[data-theme="dark"]`. Components must use
semantic variables such as `var(--bg)`, `var(--ink)`, and `var(--accent)`
instead of inline hex, RGB, or OKLCH values.

## Typography

| Role | Font | Use |
| --- | --- | --- |
| Display | Fraunces Variable | Home and chapter headings only; always roman, never italic |
| Body | Space Grotesk | Lesson copy, navigation, and controls |
| Mono | IBM Plex Mono | Code, progress values, labels, keyboard hints, and prompts |

Headings wrap safely on small screens with `overflow-wrap: anywhere` and
`min-width: 0` where they sit in flex or grid layouts. Body copy stays readable
with a narrow measure on chapter pages.

## Page Structure

### Shell

`App.svelte` owns the persistent header, responsive chapter sidebar, skip link,
and main content region. The sidebar is a numbered index with a single current
chapter treatment. On narrow screens it becomes a slide-in panel with a scrim.

### Home

`Home.svelte` uses a two-part workbench layout:

1. A short thesis, one primary start/resume action, and a live Python editor.
2. A numbered chapter index with completion counts.

The editor is real CodeMirror and has no simulated window controls. The offset
paper shadow is the only decorative depth treatment on the hero editor.

### Chapter

`ChapterView.svelte` keeps a narrow reading column. Prose, runnable examples,
and exercises follow the order authored in `content/`. Navigation at the bottom
uses simple bordered links rather than large promotional cards.

### Exercise

`ExerciseCard.svelte` makes the prompt, editor, primary run/check action, and
feedback the hierarchy. Hints and solutions are secondary disclosures. Solved
state uses the positive token; method requirements remain visible so technique
enforcement is transparent.

## Interaction

- Use `--speed` and `--ease-out` for color, border, and small position changes.
- Progress fill may use the longer easing already defined in the component.
- Keep motion subtle: no scroll reveals, particles, or ambient animation.
- Provide `:focus-visible` outlines for every keyboard-interactive control.
- Every runner state needs a clear loading, success, error, or timeout message.
- Respect `prefers-reduced-motion` through the global rule in `app.css`.

## Responsive Rules

The layout must work at 320, 375, 414, and 768 pixels without horizontal
scrolling. Keep `overflow-x: clip` on both `html` and `body`. On small screens:

- Collapse the home hero to one column.
- Collapse section heads to one column.
- Keep buttons and navigation labels on one line.
- Hide descriptive chapter taglines only where necessary to preserve the index.
- Keep image-bearing or content-bearing grid tracks on `minmax(0, 1fr)`.
- Allow long display headings to wrap rather than overflow.

## Content and Runtime Constraints

The client imports chapter content at build time. Python execution happens in a
Web Worker through Pyodide; it never runs on the server. Do not add API fetches
to the deployed client or put learner execution on the server.

Exercise checks must evaluate to exactly `True`. Technique requirements are
enforced from real AST call nodes, so comments and strings do not satisfy
`mustUseMethods` or `mustUseFunctions`.

## Validation

After UI changes, run:

```sh
bun run check
bun run lint
bun run build
```

After content or runner changes, also run:

```sh
bun client/scripts/verify-content.ts
bun client/scripts/smoke.ts
```

The project keeps Hallmark run memory in `.hallmark/log.json`. Future redesigns
should preserve this workbench direction while varying structure only when the
information architecture supports it.

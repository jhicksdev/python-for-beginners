<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { EditorView, keymap, lineNumbers, drawSelection } from "@codemirror/view";
  import { EditorState, type Extension } from "@codemirror/state";
  import { indentWithTab, history, historyKeymap, defaultKeymap } from "@codemirror/commands";
  import { StreamLanguage, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
  import { python } from "@codemirror/legacy-modes/mode/python";
  import { tags as t } from "@lezer/highlight";

  interface Props {
    value?: string;
    editable?: boolean;
    maxrows?: number;
    onsubmit?: () => void;
    onchange?: (value: string) => void;
  }

  let { value = $bindable(""), editable = true, maxrows = 24, onsubmit, onchange }: Props = $props();

  let host: HTMLDivElement;
  let view: EditorView | undefined;

  const pythonHighlight = HighlightStyle.define([
    { tag: t.keyword, color: "var(--tok-keyword)" },
    { tag: t.string, color: "var(--tok-string)" },
    { tag: t.number, color: "var(--tok-number)" },
    { tag: [t.bool, t.null], color: "var(--tok-constant)" },
    { tag: [t.className, t.constant(t.name)], color: "var(--tok-constant)" },
    { tag: [t.function(t.variableName), t.definition(t.variableName)], color: "var(--tok-method)" },
    { tag: t.comment, color: "var(--tok-comment)", fontStyle: "italic" },
    { tag: [t.punctuation, t.operator], color: "var(--tok-punct)" },
    { tag: t.variableName, color: "var(--tok-variable)" },
    { tag: t.local(t.variableName), color: "var(--tok-variable)" },
    { tag: t.special(t.variableName), color: "var(--tok-constant)" },
  ]);

  const editorTheme = EditorView.theme({
    "&": {
      backgroundColor: "transparent",
      color: "var(--ink)",
      fontSize: "13.5px",
    },
    ".cm-content": {
      fontFamily: "var(--font-mono)",
       caretColor: "var(--ink)",
      paddingBottom: "10px",
    },
    ".cm-line": {
      padding: "0 14px",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      borderRight: "1px solid var(--code-border)",
      color: "var(--ink-3)",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "transparent",
      color: "var(--ink-2)",
    },
    ".cm-activeLine": {
      backgroundColor: "color-mix(in srgb, var(--surface-2) 55%, transparent)",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "var(--accent-tint)",
    },
    ".cm-cursor": {
      borderLeftWidth: "2px",
      borderLeftColor: "var(--ink)",
    },
  });

  function buildExtensions(): Extension[] {
    const extensions: Extension[] = [
      lineNumbers(),
      history(),
      drawSelection(),
      EditorView.lineWrapping,
      StreamLanguage.define(python),
      syntaxHighlighting(pythonHighlight),
      editorTheme,
      keymap.of([
        indentWithTab,
        {
          key: "Mod-Enter",
          preventDefault: true,
          run: () => {
            onsubmit?.();
            return true;
          },
        },
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorState.readOnly.of(!editable),
      EditorView.contentAttributes.of({ "aria-label": "Python code editor" }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          value = update.state.doc.toString();
          onchange?.(value);
        }
      }),
    ];
    return extensions;
  }

  onMount(() => {
    view = new EditorView({
      state: EditorState.create({ doc: value, extensions: buildExtensions() }),
      parent: host,
    });
  });

  $effect(() => {
    const external = value;
    if (view && external !== view.state.doc.toString()) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: external } });
    }
  });

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div class="editor-host" bind:this={host} style:max-height="{maxrows * 21}px"></div>

<style>
  .editor-host {
    overflow: auto;
    min-height: 44px;
    text-align: left;
  }
</style>

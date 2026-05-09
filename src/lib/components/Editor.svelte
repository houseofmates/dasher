<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { yaml } from '@codemirror/lang-yaml';
  import { EditorState } from '@codemirror/state';
  import { oneDark } from '@codemirror/theme-one-dark'; // close to the PKM aesthetic

  let { value = $bindable(''), readonly = false } = $props();
  let editorElement: HTMLDivElement;
  let view: EditorView;

  onMount(() => {
    console.log('Editor mounted with value length:', value?.length);
    const startState = EditorState.create({
      doc: value || '',
      extensions: [
        basicSetup,
        yaml(),
        EditorView.lineWrapping,
        readonly ? EditorState.readOnly.of(true) : [],
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: "transparent",
            color: "#ffffff"
          },
          "&.cm-focused": {
            outline: "none"
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            color: "#333333",
            border: "none",
            minWidth: "40px"
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(255,255,255,0.03)"
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(255,255,255,0.02)"
          },
          ".cm-content": {
            fontFamily: "'Droid Sans Mono', monospace",
            fontSize: "13px",
            padding: "1rem 0"
          },
          ".cm-cursor": {
            borderLeftColor: "var(--color-accent-yellow)"
          }
        }, { dark: true }),
        oneDark,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            value = update.state.doc.toString();
          }
        })
      ]
    });

    view = new EditorView({
      state: startState,
      parent: editorElement
    });
  });

  onDestroy(() => {
    if (view) view.destroy();
  });

  // reactive update from outside
  $effect(() => {
    if (view && value !== view.state.doc.toString()) {
      console.log('Editor reactive update, new length:', value?.length);
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value || '' }
      });
    }
  });
</script>

<div class="h-full w-full rounded-2xl overflow-hidden border border-white/5 bg-surface/40 backdrop-blur-md transition-all focus-within:border-white/20" bind:this={editorElement}></div>

<style>
  :global(.cm-editor) {
    height: 100%;
  }
  :global(.cm-scroller) {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
</style>

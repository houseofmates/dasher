<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    x: number;
    y: number;
    show: boolean;
    onClose: () => void;
    children: Snippet;
  }

  let { x, y, show, onClose, children }: Props = $props();
  let menuElement: HTMLDivElement;

  $effect(() => {
    if (show && menuElement) {
      const rect = menuElement.getBoundingClientRect();
      const padding = 10;
      
      if (x + rect.width > window.innerWidth) {
        x = window.innerWidth - rect.width - padding;
      }
      if (y + rect.height > window.innerHeight) {
        y = window.innerHeight - rect.height - padding;
      }
    }
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  function handleOutsideClick(e: MouseEvent) {
    if (show && menuElement && !menuElement.contains(e.target as Node)) {
      onClose();
    }
  }

  onMount(() => {
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if show}
  <div 
    bind:this={menuElement}
    class="fixed z-[100] min-w-[160px] bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
    style="left: {x}px; top: {y}px;"
    in:scale={{ duration: 150, start: 0.95 }}
    out:fade={{ duration: 100 }}
  >
    {@render children()}
  </div>
{/if}

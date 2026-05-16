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
  let menuElement = $state<HTMLDivElement>();
  let manualX = $state<number | null>(null);
  let manualY = $state<number | null>(null);

  let adjustedX = $derived(manualX ?? x);
  let adjustedY = $derived(manualY ?? y);

  $effect(() => {
    if (show && menuElement) {
      const rect = menuElement.getBoundingClientRect();
      const padding = 10;
      
      if (x + rect.width > window.innerWidth) {
        manualX = window.innerWidth - rect.width - padding;
      } else {
        manualX = null;
      }

      if (y + rect.height > window.innerHeight) {
        manualY = window.innerHeight - rect.height - padding;
      } else {
        manualY = null;
      }
    } else {
      manualX = null;
      manualY = null;
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
    class="fixed z-[100] min-w-[160px] bg-[#050505] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"
    style="left: {adjustedX}px; top: {adjustedY}px;"
    in:scale={{ duration: 150, start: 0.95 }}
    out:fade={{ duration: 100 }}
  >
    {@render children()}
  </div>
{/if}

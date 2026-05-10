<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Component, Snippet } from 'svelte';
  import { clsx } from 'clsx';

  interface Props {
    label: string;
    icon?: Component<any>;
    onclick: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
  }

  let { label, icon: Icon, onclick, variant = 'default', disabled = false }: Props = $props();
  let spanElement: HTMLSpanElement;
  
  // Force label to lowercase
  $: lowercaseLabel = label.toLowerCase();
  
  // Force text to lowercase after mount
  onMount(() => {
    if (spanElement) {
      spanElement.textContent = label.toLowerCase();
      spanElement.style.textTransform = 'lowercase';
    }
  });
</script>

<button
  class={clsx(
    "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left",
    variant === 'danger' ? "text-red-400 hover:bg-red-500/10" : "text-white/80 hover:bg-white/5",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
  )}
  {onclick}
  {disabled}
>
  {#if Icon}
    <Icon size={18} />
  {/if}
  <span bind:this={spanElement} class="context-menu-item" style="text-transform: lowercase !important;">{lowercaseLabel}</span>
</button>

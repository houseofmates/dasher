<script lang="ts">
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
  <span class="context-menu-item" style="text-transform: lowercase !important;">{label.toLowerCase()}</span>
</button>

<script lang="ts">
  import { toasts } from '$lib/toast';
  import { flip } from 'svelte/animate';
  import { fade, slide } from 'svelte/transition';
  import { 
    CheckCircle, 
    XCircle, 
    Info, 
    Warning,
    X
  } from 'phosphor-svelte';

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: Warning
  };

  const colors = {
    success: 'text-green-400 border-green-500/20 bg-green-500/10',
    error: 'text-red-400 border-red-500/20 bg-red-500/10',
    info: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
    warning: 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10'
  };
</script>

<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
  {#each $toasts as toast (toast.id)}
    <div
      animate:flip={{ duration: 300 }}
      in:slide={{ axis: 'y', duration: 300 }}
      out:fade={{ duration: 200 }}
      class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl {colors[toast.type]}"
    >
      <div class="mt-0.5">
        <svelte:component this={icons[toast.type]} size={20} weight="fill" />
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium leading-relaxed lowercase">
          {toast.message}
        </p>
      </div>

      <button
        onclick={() => toasts.remove(toast.id)}
        class="opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  {/each}
</div>

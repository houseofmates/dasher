<script lang="ts">
  import StatsChart from '$lib/components/StatsChart.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import { invalidateAll } from '$app/navigation';
  import { 
    Play, 
    Stop, 
    ArrowClockwise, 
    Terminal as TerminalIcon,
    ArrowLeft,
    Trash,
    CircleNotch
  } from 'phosphor-svelte';
  import { clsx } from 'clsx';
  import { toasts } from '$lib/toast';

  let { data } = $props();
  let logsElement: HTMLDivElement;
  let logs = $state<string[]>([]);
  let eventSource: EventSource;

  onMount(() => {
    eventSource = new EventSource(`/api/containers/${data.container.id}/logs`);
    eventSource.onmessage = (event) => {
      logs = [...logs, event.data].slice(-100);
      setTimeout(() => {
        if (logsElement) logsElement.scrollTop = logsElement.scrollHeight;
      }, 0);
    };
  });

  onDestroy(() => {
    if (eventSource) eventSource.close();
  });

  async function performAction(action: string) {
    if (action === 'remove' && !confirm('are you sure? delete this container?')) return;
    
    loadingAction = action;
    try {
      const res = await fetch(`/api/containers/${data.container.id}/${action}`, { method: 'POST' });
      if (res.ok) {
        toasts.success(`${action} successful`);
        if (action === 'remove') {
          window.location.href = '/containers';
        } else {
          invalidateAll();
        }
      } else {
        const error = await res.json();
        toasts.error(error.message || `failed to ${action} container`);
      }
    } catch (err) {
      toasts.error('network error');
    } finally {
      loadingAction = null;
    }
  }

  let loadingAction = $state<string | null>(null);
</script>

<div class="space-y-6 pb-20">
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <a href="/containers" class="p-2 hover:bg-white/5 rounded-lg transition-all">
        <ArrowLeft size={24} />
      </a>
      <div>
        <h2 class="text-3xl font-bold tracking-tight preserve-case">{data.container.name}</h2>
        <p class="text-xs text-white/40 font-mono mt-0.5">{data.container.id.substring(0, 12)}</p>
      </div>
    </div>
    
    <button 
      class="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
      onclick={() => performAction('remove')}
      disabled={loadingAction === 'remove'}
    >
      {#if loadingAction === 'remove'}
        <CircleNotch size={24} class="animate-spin" />
      {:else}
        <Trash size={24} />
      {/if}
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 card space-y-6">
      <div>
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">resource usage</p>
        <div class="h-64 bg-black/20 rounded-xl overflow-hidden border border-white/5">
          <StatsChart containerId={data.container.id} />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="card space-y-4">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest">quick actions</p>
        <div class="grid grid-cols-2 gap-3">
          {#if data.container.state !== 'running'}
            <button class="btn-primary flex items-center justify-center gap-2 py-3" onclick={() => performAction('start')} disabled={loadingAction !== null}>
              {#if loadingAction === 'start'}
                <CircleNotch size={18} class="animate-spin" />
              {:else}
                <Play size={18} weight="fill" />
                start
              {/if}
            </button>
          {:else}
            <button class="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 py-3 transition-all" onclick={() => performAction('stop')} disabled={loadingAction !== null}>
              {#if loadingAction === 'stop'}
                <CircleNotch size={18} class="animate-spin" />
              {:else}
                <Stop size={18} weight="fill" />
                stop
              {/if}
            </button>
          {/if}
          <button class="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl flex items-center justify-center gap-2 py-3 transition-all" onclick={() => performAction('restart')} disabled={loadingAction !== null}>
            {#if loadingAction === 'restart'}
              <CircleNotch size={18} class="animate-spin" />
            {:else}
              <ArrowClockwise size={18} />
              restart
            {/if}
          </button>
        </div>
        <a href="/terminal?id={data.container.id}" class="btn-secondary w-full flex items-center gap-3 justify-center">
          <TerminalIcon size={20} />
          exec
        </a>
      </div>
    </div>
    <!-- CPU Stats -->
    <div class="card space-y-4">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest">cpu usage</p>
      <StatsChart id={data.container.id} label="cpu" />
    </div>

    <!-- RAM Stats -->
    <div class="card space-y-4">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest">memory usage</p>
      <StatsChart id={data.container.id} label="ram" />
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Details -->
    <div class="card space-y-6">
      <div>
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">environment</p>
        <div class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {#each data.container.env as env}
            <div class="flex items-center gap-2 text-xs font-mono bg-black/30 p-2 rounded border border-white/5">
              <span class="text-accent-yellow">{env.split('=')[0]}=</span>
              <span class="text-white/60 truncate">{env.split('=')[1]}</span>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">ports</p>
        <div class="space-y-2">
          {#each Object.entries(data.container.ports || {}) as [port, bindings]}
            <div class="flex items-center justify-between text-xs font-mono bg-black/30 p-2 rounded border border-white/5">
              <span class="text-white/40">{port}</span>
              <span class="text-accent-blue">
                {bindings ? bindings.map(b => `${b.HostIp}:${b.HostPort}`).join(', ') : 'none'}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Logs -->
    <div class="card flex flex-col h-[500px]">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">live logs</p>
      <div 
        bind:this={logsElement}
        class="flex-1 bg-black/50 rounded-lg p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar"
      >
        {#each logs as log}
          <div class="whitespace-pre-wrap mb-1 text-white/70">{log}</div>
        {/each}
        {#if logs.length === 0}
          <div class="text-white/20 italic">waiting for logs...</div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
  }
</style>

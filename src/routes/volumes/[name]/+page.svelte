<script lang="ts">
  import { HardDrive, Calendar, Database, ArrowLeft, Trash } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';
  import { goto } from '$app/navigation';
  import { clsx } from 'clsx';

  let { data } = $props();
  const volume = $derived(data.volume);

  async function removeVolume() {
    if (!confirm('are you sure you want to delete this volume? this action is irreversible.')) return;
    try {
      const res = await fetch(`/api/volumes/${encodeURIComponent(volume.Name)}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('volume removed');
        goto('/volumes');
      } else {
        toasts.error('failed to remove volume');
      }
    } catch (err) {
      toasts.error('network error');
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="space-y-8 pb-20">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <a href="/volumes" class="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">
        <ArrowLeft size={20} />
      </a>
      <div>
        <h2 class="text-3xl font-bold tracking-tight preserve-case">{volume.Name}</h2>
        <p class="text-white/40 font-mono text-xs mt-1">volume inspection</p>
      </div>
    </div>

    <button 
      class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
      onclick={removeVolume}
    >
      <Trash size={18} />
      delete volume
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Meta Info -->
    <div class="lg:col-span-1 space-y-6">
      <div class="card space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow">
            <HardDrive size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">driver</p>
            <p class="font-mono text-sm">{volume.Driver}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
            <Calendar size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">created</p>
            <p class="font-mono text-sm">{volume.CreatedAt ? formatDate(volume.CreatedAt) : 'n/a'}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-green/10 rounded-lg text-accent-green">
            <Database size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">scope</p>
            <p class="font-mono text-sm uppercase">{volume.Scope}</p>
          </div>
        </div>
      </div>

      <div class="card space-y-4">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest">mountpoint</p>
        <div class="bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-xs break-all leading-relaxed">
          {volume.Mountpoint}
        </div>
      </div>
    </div>

    <!-- Configuration / JSON -->
    <div class="lg:col-span-2 space-y-6">
      <div class="card h-full flex flex-col gap-4 min-h-[400px]">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold text-white/40 uppercase tracking-widest">labels & options</p>
        </div>

        {#if Object.keys(volume.Labels || {}).length > 0}
          <div class="grid grid-cols-1 gap-2">
            {#each Object.entries(volume.Labels || {}) as [key, val]}
              <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <span class="text-xs font-bold text-white/60 font-mono">{key}</span>
                <span class="text-xs text-accent-yellow/80 font-mono truncate max-w-[200px]">{val}</span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="flex-1 flex items-center justify-center text-white/10 italic text-sm">
            no labels defined
          </div>
        {/if}

        <div class="mt-auto pt-6 border-t border-white/5">
          <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-4">raw configuration</p>
          <div class="bg-black/40 p-4 rounded-xl font-mono text-[10px] text-white/60 overflow-x-auto whitespace-pre">
            {JSON.stringify(volume, null, 2)}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

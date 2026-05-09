<script lang="ts">
  import { HardDrive, Trash } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();

  async function removeVolume(name: string) {
    try {
      const res = await fetch(`/api/volumes/${encodeURIComponent(name)}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('volume removed');
        invalidateAll();
      } else {
        toasts.error('failed to remove volume');
      }
    } catch (err) {
      toasts.error('network error');
    }
  }
</script>

<div class="space-y-8">
  <h2 class="text-3xl font-bold tracking-tight">volumes</h2>

  <div class="bento-grid">
    {#each data.volumes as volume}
      <a href="/volumes/{encodeURIComponent(volume.Name)}" class="card flex flex-col justify-between gap-4 group hover:border-white/20 transition-all">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow group-hover:bg-accent-yellow/20 transition-colors">
            <HardDrive size={20} />
          </div>
          <p class="font-bold truncate preserve-case" title={volume.Name}>{volume.Name}</p>
        </div>
        <div class="flex items-center justify-between text-xs text-white/40 font-mono">
          <span>{volume.Driver}</span>
          <button class="hover:text-red-500 transition-colors p-1" onclick={(e) => { e.preventDefault(); removeVolume(volume.Name); }}>
            <Trash size={16} />
          </button>
        </div>
      </a>
    {/each}
  </div>
</div>

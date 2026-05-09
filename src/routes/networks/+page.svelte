<script lang="ts">
  import { ShareNetwork, Trash } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();

  async function removeNetwork(id: string) {
    try {
      const res = await fetch(`/api/networks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('network removed');
        invalidateAll();
      } else {
        toasts.error('failed to remove network');
      }
    } catch (err) {
      toasts.error('network error');
    }
  }
</script>

<div class="space-y-8">
  <h2 class="text-3xl font-bold tracking-tight">networks</h2>

  <div class="bento-grid">
    {#each data.networks as network}
      <a href="/networks/{network.Id}" class="card flex flex-col justify-between gap-4 group hover:border-white/20 transition-all">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-blue/10 rounded-lg text-accent-blue group-hover:bg-accent-blue/20 transition-colors">
            <ShareNetwork size={20} />
          </div>
          <p class="font-bold truncate preserve-case" title={network.Name}>{network.Name}</p>
        </div>
        <div class="flex items-center justify-between text-xs text-white/40 font-mono">
          <span>{network.Driver}</span>
          <button class="hover:text-red-500 transition-colors p-1" onclick={(e) => { e.preventDefault(); removeNetwork(network.Id); }}>
            <Trash size={16} />
          </button>
        </div>
      </a>
    {/each}
  </div>
</div>

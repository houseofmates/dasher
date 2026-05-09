<script lang="ts">
  import { ShareNetwork, Globe, ShieldCheck, ArrowLeft, Trash, Cube } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';
  import { goto } from '$app/navigation';
  import { clsx } from 'clsx';

  let { data } = $props();
  const network = $derived(data.network);

  async function removeNetwork() {
    if (!confirm('are you sure you want to delete this network?')) return;
    try {
      const res = await fetch(`/api/networks/${network.Id}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('network removed');
        goto('/networks');
      } else {
        toasts.error('failed to remove network');
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
      <a href="/networks" class="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">
        <ArrowLeft size={20} />
      </a>
      <div>
        <h2 class="text-3xl font-bold tracking-tight preserve-case">{network.Name}</h2>
        <p class="text-white/40 font-mono text-xs mt-1">{network.Id.substring(0, 12)}</p>
      </div>
    </div>

    <button 
      class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
      onclick={removeNetwork}
    >
      <Trash size={18} />
      delete network
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Meta Info -->
    <div class="lg:col-span-1 space-y-6">
      <div class="card space-y-6">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
            <ShareNetwork size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">driver</p>
            <p class="font-mono text-sm uppercase">{network.Driver}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow">
            <Globe size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">scope</p>
            <p class="font-mono text-sm uppercase">{network.Scope}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="p-2 bg-accent-green/10 rounded-lg text-accent-green">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p class="text-[10px] text-white/20 uppercase font-bold tracking-widest">internal</p>
            <p class="font-mono text-sm">{network.Internal ? 'yes' : 'no'}</p>
          </div>
        </div>
      </div>

      <div class="card space-y-4">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest">ipam config</p>
        {#if network.IPAM?.Config?.length > 0}
          {#each network.IPAM.Config as config}
            <div class="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
              <div class="flex justify-between">
                <span class="text-[10px] text-white/40 uppercase">subnet</span>
                <span class="text-xs font-mono">{config.Subnet}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[10px] text-white/40 uppercase">gateway</span>
                <span class="text-xs font-mono">{config.Gateway}</span>
              </div>
            </div>
          {/each}
        {:else}
          <p class="text-xs text-white/20 italic">no ipam configuration</p>
        {/if}
      </div>
    </div>

    <!-- Connected Containers -->
    <div class="lg:col-span-2 space-y-6">
      <div class="card flex-1 flex flex-col gap-4">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest">connected containers</p>
        
        {#if Object.keys(network.Containers || {}).length > 0}
          <div class="grid grid-cols-1 gap-3">
            {#each Object.entries(network.Containers || {}) as [id, info]}
              <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                <div class="flex items-center gap-4">
                  <div class="p-2 bg-white/5 rounded-lg text-white/40">
                    <Cube size={20} />
                  </div>
                  <div>
                    <p class="text-sm font-bold preserve-case">{info.Name}</p>
                    <p class="text-[10px] text-white/20 font-mono">{id.substring(0, 12)}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xs font-mono text-accent-yellow">{info.IPv4Address}</p>
                  <p class="text-[10px] text-white/20 font-mono">{info.MacAddress}</p>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="flex-1 flex items-center justify-center text-white/10 italic text-sm py-20">
            no containers connected
          </div>
        {/if}
      </div>

      <div class="card">
        <p class="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">options</p>
        <div class="grid grid-cols-2 gap-4">
          {#each Object.entries(network.Options || {}) as [key, val]}
            <div class="p-3 bg-black/20 rounded-lg border border-white/5">
              <p class="text-[9px] text-white/20 uppercase font-bold tracking-widest mb-1">{key}</p>
              <p class="text-xs font-mono text-white/60 truncate">{val}</p>
            </div>
          {:else}
            <p class="col-span-2 text-xs text-white/10 italic text-center">no custom options</p>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

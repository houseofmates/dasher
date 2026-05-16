<script lang="ts">
  import { ShareNetwork, Trash, Info, DotsThreeVertical, MagnifyingGlass } from 'phosphor-svelte';
  import { toasts } from '$lib/toast';
  import { invalidateAll } from '$app/navigation';
  import { fade, scale } from 'svelte/transition';
  import ContextMenu from '$lib/components/ContextMenu.svelte';
  import ContextMenuItem from '$lib/components/ContextMenuItem.svelte';

  let { data } = $props();
  let searchQuery = $state('');

  const filteredNetworks = $derived(
    data.networks.filter((n: any) => n.Name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  async function removeNetwork(id: string) {
    menu.show = false;
    try {
      const res = await fetch(`/api/networks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('network removed');
        invalidateAll();
      } else {
        const error = await res.json();
        toasts.error(error.message || 'failed to remove network');
      }
    } catch (err) {
      toasts.error('network error');
    }
  }

  // Context Menu State
  let menu = $state({
    show: false,
    x: 0,
    y: 0,
    network: null as any
  });

  function handleContextMenu(e: MouseEvent, network: any) {
    e.preventDefault();
    menu.x = e.clientX;
    menu.y = e.clientY;
    menu.network = network;
    menu.show = true;
  }

  function handleKeydown(e: KeyboardEvent, network: any) {
    if (e.key === 'Enter' || e.key === ' ') {
      window.location.href = `/networks/${network.Id}`;
    }
  }
</script>

<div class="space-y-8">
  <h2 class="text-3xl font-bold tracking-tight">networks</h2>

  <div class="relative">
    <MagnifyingGlass size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
    <input 
      type="text" 
      placeholder="search networks..." 
      class="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"
      bind:value={searchQuery}
    />
  </div>

  <div class="bento-grid">
    {#each filteredNetworks as network (network.Id)}
      <div 
        class="card group relative flex flex-col justify-between min-h-[200px] border border-white/5 hover:border-accent-yellow/20 transition-all overflow-hidden bg-surface/40 backdrop-blur-md cursor-pointer"
        role="button"
        tabindex="0"
        oncontextmenu={(e) => handleContextMenu(e, network)}
        onkeydown={(e) => handleKeydown(e, network)}
        in:scale={{ duration: 200, start: 0.95 }}
      >
        <div class="relative z-10 flex flex-col h-full justify-between pointer-events-none">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3 min-w-0 flex-1">
              <div class="p-2.5 bg-accent-blue/10 rounded-xl text-accent-blue shrink-0 flex items-center justify-center group-hover:bg-accent-blue/20 transition-all mt-1">
                <ShareNetwork size={22} weight="bold" />
              </div>
              <div class="min-w-0 flex-1">
                <a href="/networks/{network.Id}" class="font-black text-2xl hover:text-accent-yellow transition-colors preserve-case break-words leading-none block tracking-tighter mb-2 pointer-events-auto">
                  {network.Name}
                </a>
              </div>
            </div>
            <div class="text-white/20 group-hover:text-white/40 transition-colors pointer-events-auto shrink-0 pt-1">
              <button class="p-1 hover:text-white transition-colors" onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleContextMenu(e, network); }}>
                <DotsThreeVertical size={20} />
              </button>
            </div>
          </div>
          
          <div class="space-y-1.5 mt-4 border-t border-white/5 pt-4">
            <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]">
              <span>driver</span>
              <span class="text-white/60">{network.Driver}</span>
            </div>
            <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]">
              <span>id</span>
              <span class="text-white/60 truncate max-w-[150px] font-mono">{network.Id.slice(0, 12)}</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<ContextMenu 
  show={menu.show} 
  x={menu.x} 
  y={menu.y} 
  onClose={() => menu.show = false}
>
  {#if menu.network}
    <div class="px-4 py-2 border-b border-white/5 mb-1">
      <p class="text-[10px] font-bold text-white/20 tracking-widest truncate">network: {menu.network.Name}</p>
    </div>
    
    <a href="/networks/{menu.network.Id}" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition-colors">
      <Info size={18} />
      <span>view details</span>
    </a>
    
    <div class="border-t border-white/5 mt-1 pt-1">
      <ContextMenuItem label="delete network" icon={Trash} variant="danger" onclick={() => removeNetwork(menu.network.Id)} />
    </div>
  {/if}
</ContextMenu>

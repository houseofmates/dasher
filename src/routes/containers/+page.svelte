<script lang="ts">
  import { fade, slide, scale } from 'svelte/transition';
  import { dndzone } from 'svelte-dnd-action';
  import { invalidateAll } from '$app/navigation';
  import { 
    Play, 
    Stop, 
    ArrowClockwise, 
    Trash, 
    DotsThreeVertical,
    CheckCircle,
    XCircle,
    Clock,
    DotsSixVertical,
    Pause,
    PencilSimple,
    ArrowArcLeft
  } from 'phosphor-svelte';
  import { clsx } from 'clsx';
  import { toasts } from '$lib/toast';
  import ContextMenu from '$lib/components/ContextMenu.svelte';
  import ContextMenuItem from '$lib/components/ContextMenuItem.svelte';

  let { data } = $props();
  
  let containers = $state<any[]>([]);
  let filter = $state('all');
  let searchQuery = $state('');

  // Sync and order logic
  $effect(() => {
    const savedOrder = localStorage.getItem('container-order');
    const baseContainers = [...data.containers];
    
    if (savedOrder) {
      const orderMap = JSON.parse(savedOrder);
      containers = baseContainers.sort((a, b) => {
        const orderA = orderMap[a.id] ?? 999;
        const orderB = orderMap[b.id] ?? 999;
        return orderA - orderB;
      });
    } else {
      containers = baseContainers.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  function handleDndConsider(e: any) {
    containers = e.detail.items;
  }

  function handleDndFinalize(e: any) {
    containers = e.detail.items;
    const orderMap = containers.reduce((acc, c, idx) => ({ ...acc, [c.id]: idx }), {});
    localStorage.setItem('container-order', JSON.stringify(orderMap));
  }

  const filteredContainers = $derived(
    containers.filter(c => {
      const name = (c.name || '').toLowerCase();
      const image = (c.image || '').toLowerCase();
      const matchesSearch = name.includes(searchQuery.toLowerCase()) || image.includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'running' && c.state === 'running') ||
                           (filter === 'stopped' && c.state === 'exited') ||
                           (filter === 'errored' && (c.status.includes('unhealthy') || c.state === 'restarting'));
      return matchesSearch && matchesFilter;
    })
  );

  // Refresh status every 10 seconds
  $effect(() => {
    const interval = setInterval(() => {
      invalidateAll();
    }, 10000);
    return () => clearInterval(interval);
  });

  async function performAction(id: string, action: string) {
    loadingAction = id;
    menu.show = false;
    try {
      const res = await fetch(`/api/containers/${id}/${action}`, { method: 'POST' });
      if (res.ok) {
        toasts.success(`${action} successful`);
        invalidateAll();
      } else {
        const errData = await res.json();
        toasts.error(errData.message || `failed to ${action} container`);
      }
    } catch (err) {
      toasts.error('network error');
    } finally {
      loadingAction = null;
    }
  }

  async function renameContainer(id: string, currentName: string) {
    const newName = prompt('Enter new name:', currentName.replace(/^\//, ''));
    if (!newName || newName === currentName) return;

    loadingAction = id;
    try {
      const res = await fetch(`/api/containers/${id}/rename`, {
        method: 'POST',
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        toasts.success('container renamed');
        invalidateAll();
      } else {
        toasts.error('failed to rename container');
      }
    } catch (err) {
      toasts.error('network error');
    } finally {
      loadingAction = null;
    }
  }

  let loadingAction = $state<string | null>(null);

  // Context Menu State
  let menu = $state({
    show: false,
    x: 0,
    y: 0,
    container: null as any
  });

  function handleContextMenu(e: MouseEvent, container: any) {
    e.preventDefault();
    menu.x = e.clientX;
    menu.y = e.clientY;
    menu.container = container;
    menu.show = true;
  }
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-3xl font-bold tracking-tight">containers</h2>
    <div class="flex items-center gap-2 bg-surface p-1 rounded-lg border border-white/5">
      {#each ['all', 'running', 'stopped', 'errored'] as f}
        <button 
          class={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
            filter === f ? "bg-accent-yellow text-black" : "text-white/60 hover:text-white"
          )}
          onclick={() => filter = f}
        >
          {f}
        </button>
      {/each}
    </div>
  </div>

  <div class="relative">
    <input 
      type="text" 
      placeholder="search containers..." 
      class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"
      bind:value={searchQuery}
    />
  </div>

  <div 
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    use:dndzone={{ items: filteredContainers, flipDurationMs: 200, dragDisabled: !!loadingAction }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each filteredContainers as container (container.id)}
      <div 
        class="card group relative flex flex-col justify-between h-48 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
        animate:slide={{ duration: 200 }}
        in:fade={{ duration: 200 }}
        oncontextmenu={(e) => handleContextMenu(e, container)}
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div class={clsx(
              "w-2 h-2 rounded-full mt-2.5 shrink-0",
              container.state === 'running' ? "bg-green-500" : 
              container.state === 'exited' ? "bg-white/20" : "bg-red-500"
            )}></div>
            <div class="overflow-hidden">
              <a href="/containers/{container.id}" class="font-bold text-lg hover:text-accent-yellow transition-colors preserve-case truncate block">
                {container.name.replace(/^\//, '')}
              </a>
              <p class="text-[10px] text-white/30 font-mono mt-0.5 tracking-tight truncate">{container.image}</p>
            </div>
          </div>
          <div class="cursor-grab active:cursor-grabbing text-white/10 hover:text-white/30 transition-colors opacity-0 group-hover:opacity-100">
            <DotsSixVertical size={18} />
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between text-[10px] text-white/40 font-mono uppercase tracking-widest">
            <span>status</span>
            <span class={clsx(container.state === 'running' ? 'text-green-400' : 'text-white/40')}>{container.status}</span>
          </div>
          {#if container.ports && container.ports.length > 0}
            <div class="flex flex-wrap gap-1 mt-2">
              {#each container.ports.slice(0, 3) as port}
                <span class="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/60">
                  {port.PublicPort ? `${port.PublicPort}:${port.PrivatePort}` : port.PrivatePort}
                </span>
              {/each}
              {#if container.ports.length > 3}
                <span class="text-[10px] text-white/20">+{container.ports.length - 3}</span>
              {/if}
            </div>
          {/if}
        </div>

        <div class="flex items-center justify-end gap-1 mt-4 border-t border-white/5 pt-3">
          {#if loadingAction === container.id}
            <div class="p-2 animate-spin text-accent-yellow">
              <ArrowClockwise size={18} />
            </div>
          {:else}
            {#if container.state !== 'running'}
              <button class="p-2 hover:text-green-500 transition-colors" onclick={() => performAction(container.id, 'start')} title="start">
                <Play size={18} weight="fill" />
              </button>
            {:else}
              <button class="p-2 hover:text-red-500 transition-colors" onclick={() => performAction(container.id, 'stop')} title="stop">
                <Stop size={18} weight="fill" />
              </button>
              <button class="p-2 hover:text-accent-blue transition-colors" onclick={() => performAction(container.id, 'restart')} title="restart">
                <ArrowClockwise size={18} />
              </button>
            {/if}
            <button class="p-2 hover:text-white/60 transition-colors" onclick={(e) => handleContextMenu(e, container)}>
              <DotsThreeVertical size={18} />
            </button>
          {/if}
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
  {#if menu.container}
    <div class="px-4 py-2 border-b border-white/5 mb-1">
      <p class="text-[10px] font-bold text-white/20 uppercase tracking-widest">container: {menu.container.name.replace(/^\//, '')}</p>
    </div>
    
    {#if menu.container.state !== 'running'}
      <ContextMenuItem label="start" icon={Play} onclick={() => performAction(menu.container.id, 'start')} />
    {:else}
      <ContextMenuItem label="stop" icon={Stop} onclick={() => performAction(menu.container.id, 'stop')} />
      <ContextMenuItem label="restart" icon={ArrowClockwise} onclick={() => performAction(menu.container.id, 'restart')} />
      {#if menu.container.state === 'running'}
        <ContextMenuItem label="pause" icon={Pause} onclick={() => performAction(menu.container.id, 'pause')} />
      {/if}
    {/if}
    
    {#if menu.container.state === 'paused'}
      <ContextMenuItem label="resume" icon={Play} onclick={() => performAction(menu.container.id, 'unpause')} />
    {/if}

    <ContextMenuItem label="rename" icon={PencilSimple} onclick={() => renameContainer(menu.container.id, menu.container.name)} />
    
    <div class="border-t border-white/5 mt-1 pt-1">
      <ContextMenuItem label="delete" icon={Trash} variant="danger" onclick={() => performAction(menu.container.id, 'remove')} />
    </div>
  {/if}
</ContextMenu>

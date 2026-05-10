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

  function handleKeydown(e: KeyboardEvent, container: any) {
    if (e.key === 'Enter' || e.key === ' ') {
      window.location.href = `/containers/${container.id}`;
    }
  }
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-3xl font-bold tracking-tight">containers</h2>
    <div class="flex items-center gap-2 bg-surface p-1 rounded-lg border border-white/5">
      {#each ['all', 'running', 'stopped', 'errored'] as f}
        <button 
          class={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all lowercase",
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
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
    use:dndzone={{ items: filteredContainers, flipDurationMs: 200, dragDisabled: !!loadingAction }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
  >
    {#each filteredContainers as container (container.id)}
      <div 
        class="card group relative flex flex-col justify-between min-h-[200px] border border-white/5 hover:border-accent-yellow/20 transition-all overflow-hidden bg-surface/40 backdrop-blur-md cursor-pointer"
        animate:slide={{ duration: 200 }}
        in:fade={{ duration: 200 }}
        role="button"
        tabindex="0"
        oncontextmenu={(e) => handleContextMenu(e, container)}
        onkeydown={(e) => handleKeydown(e, container)}
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0 flex-1">
            <div class={clsx(
              "w-2 h-2 rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]",
              container.state === 'running' ? "bg-green-500 shadow-green-500/20" : 
              container.state === 'exited' ? "bg-white/20" : "bg-red-500 shadow-red-500/20"
            )}></div>
            <div class="min-w-0 flex-1">
              <a href="/containers/{container.id}" class="font-black text-2xl hover:text-accent-yellow transition-colors preserve-case break-words leading-none block tracking-tighter mb-2">
                {container.name.replace(/^\//, '')}
              </a>
              <p class="text-[10px] text-white/40 font-mono tracking-tight truncate opacity-70 group-hover:opacity-100 transition-opacity bg-white/5 px-2 py-0.5 rounded w-fit border border-white/5">{container.image}</p>
            </div>
          </div>
          <div class="cursor-grab active:cursor-grabbing text-white/10 hover:text-white/30 transition-colors shrink-0 pt-1">
            <DotsSixVertical size={16} />
          </div>
        </div>

        <div class="space-y-1.5 mt-4">
          <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]">
            <span>status</span>
            <span class={clsx(container.state === 'running' ? 'text-green-400' : 'text-white/30')}>{container.status}</span>
          </div>
          {#if container.ports && container.ports.length > 0}
            <div class="flex flex-wrap gap-1 mt-2">
              {#each container.ports.slice(0, 4) as port}
                <span class="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/50 border border-white/5">
                  {port.PublicPort ? `${port.PublicPort}:${port.PrivatePort}` : port.PrivatePort}
                </span>
              {/each}
              {#if container.ports.length > 4}
                <span class="text-[10px] text-white/20">+{container.ports.length - 4}</span>
              {/if}
            </div>
          {/if}
        </div>

        <div class="flex items-center justify-end gap-1 mt-6 border-t border-white/5 pt-3 -mx-2 px-2">
          {#if loadingAction === container.id}
            <div class="p-2 animate-spin text-accent-yellow">
              <ArrowClockwise size={18} />
            </div>
          {:else}
            {#if container.state !== 'running'}
              <button class="p-2 text-white/20 hover:text-green-500 transition-colors" onclick={(e) => { e.stopPropagation(); performAction(container.id, 'start'); }} title="start">
                <Play size={18} weight="fill" />
              </button>
            {:else}
              <button class="p-2 text-white/20 hover:text-red-500 transition-colors" onclick={(e) => { e.stopPropagation(); performAction(container.id, 'stop'); }} title="stop">
                <Stop size={18} weight="fill" />
              </button>
              <button class="p-2 text-white/20 hover:text-accent-blue transition-colors" onclick={(e) => { e.stopPropagation(); performAction(container.id, 'restart'); }} title="restart">
                <ArrowClockwise size={18} />
              </button>
            {/if}
            <button class="p-2 text-white/20 hover:text-white transition-colors" onclick={(e) => { e.stopPropagation(); handleContextMenu(e, container); }}>
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
      <p class="text-[10px] font-bold text-white/20 tracking-widest">container: {menu.container.name.replace(/^\//, '')}</p>
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

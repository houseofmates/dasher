<script lang="ts">
  import { onMount } from 'svelte';
  import { Pulse, Cube, Images, HardDrive, ShareNetwork, Funnel } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';
  import { clsx } from 'clsx';

  interface DockerEvent {
    type: string;
    action: string;
    actor: string;
    time: number;
  }

  let events = $state<DockerEvent[]>([]);
  let filter = $state<string | null>(null);

  const filteredEvents = $derived(
    filter ? events.filter(e => e.type === filter) : events
  );

  onMount(() => {
    const eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        events = [event, ...events].slice(0, 50);
      } catch (err) {
        console.error('Failed to parse event:', err);
      }
    };

    return () => eventSource.close();
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'container': return Cube;
      case 'image': return Images;
      case 'volume': return HardDrive;
      case 'network': return ShareNetwork;
      default: return Pulse;
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('die') || action.includes('kill') || action.includes('stop') || action.includes('delete')) return 'text-red-400';
    if (action.includes('start') || action.includes('create')) return 'text-green-400';
    if (action.includes('restart')) return 'text-accent-blue';
    return 'text-white/40';
  };

  const filterTypes = [
    { id: 'container', icon: Cube },
    { id: 'image', icon: Images },
    { id: 'volume', icon: HardDrive },
    { id: 'network', icon: ShareNetwork }
  ];
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h3 class="text-lg font-bold">recent activity</h3>
      <div class="flex items-center gap-1 bg-surface border border-white/5 p-1 rounded-lg">
        <button 
          class={clsx("p-1.5 rounded-md transition-all", filter === null ? "bg-accent-yellow text-black" : "text-white/40 hover:bg-white/5")}
          onclick={() => filter = null}
          title="all"
        >
          <Funnel size={14} weight={filter === null ? "fill" : "regular"} />
        </button>
        {#each filterTypes as type}
          <button 
            class={clsx("p-1.5 rounded-md transition-all", filter === type.id ? "bg-accent-yellow text-black" : "text-white/40 hover:bg-white/5")}
            onclick={() => filter = type.id}
            title={type.id}
          >
            <type.icon size={14} weight={filter === type.id ? "fill" : "regular"} />
          </button>
        {/each}
      </div>
    </div>
    <button class="text-xs text-white/40 hover:text-white transition-colors font-bold tracking-widest" onclick={() => events = []}>clear</button>
  </div>
  
  <div class="card min-h-[300px] flex flex-col gap-2 overflow-y-auto max-h-[600px] custom-scrollbar">
    {#if filteredEvents.length === 0}
      <div class="flex-1 flex flex-col items-center justify-center text-white/20 italic p-12" in:fade>
        <Pulse size={48} weight="thin" class="mb-4 opacity-20" />
        <p class="text-sm">no {filter || ''} events recorded</p>
      </div>
    {:else}
      {#each filteredEvents as event}
        <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group" in:slide>
          <div class={clsx(
            "p-2.5 rounded-lg transition-colors",
            event.type === 'container' ? 'bg-accent-yellow/10 text-accent-yellow' :
            event.type === 'image' ? 'bg-accent-blue/10 text-accent-blue' :
            'bg-white/5 text-white/40'
          )}>
            {#if event.type === 'container'}
              <Cube size={18} />
            {:else if event.type === 'image'}
              <Images size={18} />
            {:else if event.type === 'volume'}
              <HardDrive size={18} />
            {:else if event.type === 'network'}
              <ShareNetwork size={18} />
            {:else}
              <Pulse size={18} />
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold truncate preserve-case group-hover:text-white transition-colors">{event.actor}</span>
              <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 tracking-tighter {getActionColor(event.action)} border border-white/5">{event.action}</span>
            </div>
            <p class="text-[9px] text-white/20 font-bold tracking-[0.2em] mt-1">{event.type}</p>
          </div>
          <span class="text-[10px] text-white/20 font-mono bg-white/5 px-2 py-1 rounded">
            {new Date(event.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      {/each}
    {/if}
  </div>
</div>

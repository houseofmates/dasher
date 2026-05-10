<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { invalidateAll } from '$app/navigation';
  import { MagnifyingGlass, Trash, Download, CircleNotch, Info, DotsThreeVertical, Tag } from 'phosphor-svelte';
  import { clsx } from 'clsx';
  import { toasts } from '$lib/toast';
  import ContextMenu from '$lib/components/ContextMenu.svelte';
  import ContextMenuItem from '$lib/components/ContextMenuItem.svelte';

  let { data } = $props();
  let searchQuery = $state('');
  let pulling = $state(false);
  let newImage = $state('');

  const filteredImages = $derived(
    data.images.filter(img => 
      img.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  function formatSize(bytes: number) {
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(2)} gb` : `${mb.toFixed(2)} mb`;
  }

  async function removeImage(id: string) {
    loadingAction = id;
    menu.show = false;
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('image removed');
        invalidateAll();
      } else {
        const error = await res.json();
        toasts.error(error.message || 'failed to remove image');
      }
    } catch (err) {
      toasts.error('network error');
    } finally {
      loadingAction = null;
    }
  }

  let loadingAction = $state<string | null>(null);

  let pullProgress = $state<any[]>([]);

  async function pullImage() {
    if (!newImage) return;
    pulling = true;
    pullProgress = [];
    toasts.info(`starting pull for ${newImage}...`);
    
    try {
      const res = await fetch('/api/images/pull', {
        method: 'POST',
        body: JSON.stringify({ image: newImage })
      });

      if (!res.ok) throw new Error('failed to start pull');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('no body');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'progress') {
                // update progress
                const existing = pullProgress.find(p => p.id === data.event.id);
                if (existing) {
                  existing.status = data.event.status;
                  existing.progress = data.event.progress;
                } else if (data.event.id) {
                  pullProgress = [...pullProgress, data.event];
                }
              } else if (data.type === 'error') {
                toasts.error(data.message);
                break;
              } else if (data.type === 'done') {
                toasts.success(`successfully pulled ${newImage}`);
                newImage = '';
                invalidateAll();
                setTimeout(() => pullProgress = [], 3000);
              }
            } catch (e) {}
          }
        }
      }
    } catch (err: any) {
      toasts.error(err.message || 'network error');
    } finally {
      pulling = false;
    }
  }

  async function tagImage(id: string) {
    const tag = prompt('enter new tag (e.g. my-image:v1):');
    if (!tag) return;
    
    try {
      const res = await fetch(`/api/images/${id}/tag`, {
        method: 'POST',
        body: JSON.stringify({ tag })
      });
      if (res.ok) {
        toasts.success('image tagged');
        invalidateAll();
      } else {
        const err = await res.json();
        toasts.error(err.message || 'failed to tag image');
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
    image: null as any
  });

  function handleContextMenu(e: MouseEvent, image: any) {
    e.preventDefault();
    menu.x = e.clientX;
    menu.y = e.clientY;
    menu.image = image;
    menu.show = true;
  }

  function handleKeydown(e: KeyboardEvent, image: any) {
    if (e.key === 'Enter' || e.key === ' ') {
      window.location.href = `/images/${image.id}`;
    }
  }
</script>

<div class="space-y-8">
  <div class="flex items-center justify-between">
    <h2 class="text-3xl font-bold tracking-tight">images</h2>
  </div>

  <div class="flex gap-4">
    <div class="relative flex-1">
      <MagnifyingGlass size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
      <input 
        type="text" 
        placeholder="search images..." 
        class="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"
        bind:value={searchQuery}
      />
    </div>
    <div class="flex gap-2">
      <input 
        type="text" 
        placeholder="pull image (e.g. nginx:latest)" 
        class="bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case w-64"
        bind:value={newImage}
      />
      <button 
        class="btn-primary flex items-center gap-2 min-w-[100px] justify-center" 
        onclick={pullImage}
        disabled={pulling || !newImage}
      >
        {#if pulling}
          <CircleNotch size={20} class="animate-spin" />
          pulling...
        {:else}
          <Download size={20} />
          pull
        {/if}
      </button>
    </div>
  </div>

  {#if pullProgress.length > 0}
    <div class="card bg-black/40 border-accent-yellow/20 space-y-3" transition:slide>
      <div class="flex items-center justify-between">
        <p class="text-xs font-bold text-accent-yellow tracking-widest">pulling progress</p>
        <CircleNotch size={14} class="animate-spin text-accent-yellow" />
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
        {#each pullProgress as p}
          <div class="flex flex-col gap-1">
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-white/40">{p.id || 'system'}</span>
              <span class="text-white/60">{p.status}</span>
            </div>
            {#if p.progressDetail?.current}
              <div class="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-accent-yellow transition-all duration-300" 
                  style="width: {(p.progressDetail.current / p.progressDetail.total) * 100}%"
                ></div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="bento-grid">
    {#each filteredImages as img (img.id)}
      <div 
        class="card group relative flex flex-col justify-between min-h-[200px] border border-white/5 hover:border-accent-yellow/20 transition-all overflow-hidden bg-surface/40 backdrop-blur-md cursor-pointer"
        in:scale={{ duration: 200, start: 0.95 }}
        out:fade={{ duration: 150 }}
        role="button"
        tabindex="0"
        oncontextmenu={(e) => handleContextMenu(e, img)}
        onkeydown={(e) => handleKeydown(e, img)}
      >
        <div class="relative z-10 flex flex-col h-full justify-between pointer-events-none">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <a href="/images/{img.id}" class="font-black text-2xl hover:text-accent-yellow transition-colors preserve-case break-words leading-none block tracking-tighter mb-2 pointer-events-auto">
                {img.tags[0]?.split(':')[0] || 'untagged'}
              </a>
              <div class="flex flex-wrap gap-1">
                {#each img.tags as tag}
                  <span class="text-[10px] text-white/40 font-mono tracking-tight truncate opacity-70 bg-white/5 px-2 py-0.5 rounded border border-white/5">{tag.split(':')[1] || 'latest'}</span>
                {/each}
              </div>
              <p class="text-[10px] text-white/20 font-mono truncate tracking-tighter mt-2">{img.id.replace('sha256:', '').slice(0, 12)}</p>
            </div>
            <div class="text-white/20 group-hover:text-white/40 transition-colors pointer-events-auto shrink-0 pt-1">
               <button class="p-1 hover:text-white" onclick={(e) => { e.preventDefault(); e.stopPropagation(); handleContextMenu(e, img); }}>
                <DotsThreeVertical size={20} />
               </button>
            </div>
          </div>
          
          <div class="space-y-1.5 mt-4 border-t border-white/5 pt-4">
            <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]">
              <span>size</span>
              <span class="text-white/60">{formatSize(img.size)}</span>
            </div>
            <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]">
              <span>created</span>
              <span class="text-white/60">{new Date(img.created * 1000).toLocaleDateString()}</span>
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
  {#if menu.image}
    <div class="px-4 py-2 border-b border-white/5 mb-1">
      <p class="text-[10px] font-bold text-white/20 tracking-widest truncate">image: {menu.image.tags[0] || 'untagged'}</p>
    </div>
    
    <a href="/images/{menu.image.id}" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition-colors">
      <Info size={18} />
      <span>view details</span>
    </a>
    
    <ContextMenuItem label="pull latest" icon={Download} onclick={() => { newImage = menu.image.tags[0]; pullImage(); }} />
    <ContextMenuItem label="rename / tag" icon={Tag} onclick={() => tagImage(menu.image.id)} />
    
    <div class="border-t border-white/5 mt-1 pt-1">
      <ContextMenuItem label="delete image" icon={Trash} variant="danger" onclick={() => removeImage(menu.image.id)} />
    </div>
  {/if}
</ContextMenu>

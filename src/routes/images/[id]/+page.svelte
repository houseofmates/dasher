<script lang="ts">
  import { ArrowLeft, Trash, Tag, Calendar, HardDrive, Info } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';
  import { toasts } from '$lib/toast';
  import { goto } from '$app/navigation';

  let { data } = $props();
  const image = $derived(data.image);

  function formatSize(bytes: number) {
    const mb = bytes / (1024 * 1024);
    return mb > 1024 ? `${(mb / 1024).toFixed(2)} gb` : `${mb.toFixed(2)} mb`;
  }

  async function removeImage() {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`/api/images/${data.id}`, { method: 'DELETE' });
      if (res.ok) {
        toasts.success('image removed');
        goto('/images');
      } else {
        toasts.error('failed to remove image');
      }
    } catch (err) {
      toasts.error('network error');
    }
  }
</script>

<div class="space-y-8">
  <div class="flex items-center gap-4">
    <a href="/images" class="p-2 hover:bg-white/5 rounded-lg transition-colors">
      <ArrowLeft size={24} />
    </a>
    <h2 class="text-3xl font-bold tracking-tight">image details</h2>
  </div>

  {#if image}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="card space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">tags</h3>
            <button class="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm" onclick={removeImage}>
              <Trash size={18} />
              delete image
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each image.RepoTags || [] as tag}
              <span class="px-3 py-1 bg-accent-yellow/10 text-accent-yellow rounded-full text-sm font-medium border border-accent-yellow/20">
                {tag}
              </span>
            {/each}
          </div>
        </div>

        <div class="card space-y-4">
          <h3 class="text-xl font-bold">configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-[10px] text-white/40 uppercase tracking-widest font-bold">architecture</p>
              <p class="font-mono text-sm">{image.Architecture}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] text-white/40 uppercase tracking-widest font-bold">os</p>
              <p class="font-mono text-sm">{image.Os}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] text-white/40 uppercase tracking-widest font-bold">docker version</p>
              <p class="font-mono text-sm">{image.DockerVersion}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] text-white/40 uppercase tracking-widest font-bold">author</p>
              <p class="font-mono text-sm truncate">{image.Author || 'N/A'}</p>
            </div>
          </div>
        </div>

        {#if image.Config && image.Config.Env}
          <div class="card space-y-4">
            <h3 class="text-xl font-bold">environment variables</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {#each image.Config.Env as env}
                <div class="p-3 bg-black/20 border border-white/5 rounded-lg font-mono text-xs break-all">
                  {env}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="space-y-6">
        <div class="card space-y-4">
          <div class="flex items-center gap-3 text-accent-yellow">
            <Info size={20} />
            <span class="font-bold uppercase text-xs tracking-widest">quick info</span>
          </div>
          <div class="space-y-4 pt-2">
            <div class="flex justify-between items-center">
              <span class="text-white/40 text-sm">Size</span>
              <span class="font-mono">{formatSize(image.Size)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/40 text-sm">Created</span>
              <span class="font-mono">{new Date(image.Created).toLocaleDateString()}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-white/40 text-sm">Layers</span>
              <span class="font-mono">{image.RootFS?.Layers?.length || 0}</span>
            </div>
          </div>
        </div>

        {#if image.Config && image.Config.ExposedPorts}
          <div class="card space-y-4">
            <div class="flex items-center gap-3 text-accent-blue">
              <Tag size={20} />
              <span class="font-bold uppercase text-xs tracking-widest">exposed ports</span>
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              {#each Object.keys(image.Config.ExposedPorts) as port}
                <span class="px-2 py-1 bg-white/5 rounded text-xs font-mono">{port}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

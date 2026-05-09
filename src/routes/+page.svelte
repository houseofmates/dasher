<script lang="ts">
  import { Cube, Images, HardDrives, Globe, Pulse } from 'phosphor-svelte';
  import { clsx } from 'clsx';

  let { data } = $props();
</script>

<div class="space-y-8">
  <div class="flex flex-col gap-1">
    <h2 class="text-3xl font-bold tracking-tight">dashboard</h2>
    <p class="text-white/40 text-sm">system overview and resource distribution</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Containers Card -->
    <a href="/containers" class="card group hover:border-accent-yellow/50 transition-all">
      <div class="flex items-start justify-between">
        <div class="p-3 bg-accent-yellow/10 rounded-xl text-accent-yellow">
          <Cube size={24} weight="duotone" />
        </div>
        <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
          {data.stats.containers.running} running
        </span>
      </div>
      <div class="mt-4">
        <h3 class="text-3xl font-bold">{data.stats.containers.total}</h3>
        <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">containers</p>
      </div>
    </a>

    <!-- Images Card -->
    <a href="/images" class="card group hover:border-accent-blue/50 transition-all">
      <div class="flex items-start justify-between">
        <div class="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">
          <Images size={24} weight="duotone" />
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-3xl font-bold">{data.stats.images}</h3>
        <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">images</p>
      </div>
    </a>

    <!-- Volumes Card -->
    <div class="card group">
      <div class="flex items-start justify-between">
        <div class="p-3 bg-purple-500/10 rounded-xl text-purple-500">
          <HardDrives size={24} weight="duotone" />
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-3xl font-bold">{data.stats.volumes}</h3>
        <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">volumes</p>
      </div>
    </div>

    <!-- Networks Card -->
    <div class="card group">
      <div class="flex items-start justify-between">
        <div class="p-3 bg-orange-500/10 rounded-xl text-orange-500">
          <Globe size={24} weight="duotone" />
        </div>
      </div>
      <div class="mt-4">
        <h3 class="text-3xl font-bold">{data.stats.networks}</h3>
        <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">networks</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Quick Actions/Links -->
    <div class="lg:col-span-2 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">recent activity</h3>
        <button class="text-xs text-white/40 hover:text-white transition-colors">view all</button>
      </div>
      <div class="card space-y-4 min-h-[300px] flex flex-col items-center justify-center text-white/20 italic">
        <Pulse size={48} weight="thin" class="mb-4 opacity-20" />
        no recent events recorded
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-bold">system status</h3>
      <div class="card space-y-6">
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-white/60">docker engine</span>
            <span class="text-green-500 font-bold">healthy</span>
          </div>
          <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full w-full"></div>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-white/60">api connectivity</span>
            <span class="text-green-500 font-bold">online</span>
          </div>
          <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div class="bg-green-500 h-full w-full"></div>
          </div>
        </div>

        <div class="pt-4 border-t border-white/5">
          <p class="text-[10px] text-white/20 uppercase font-bold tracking-tighter">node version</p>
          <p class="text-xs font-mono text-white/40">v22.x (stable)</p>
        </div>
      </div>
    </div>
  </div>
</div>

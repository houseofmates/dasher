<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import uPlot from 'uplot';
  import 'uplot/dist/uPlot.min.css';
  import { clsx } from 'clsx';

  let { data } = $props();
  let chartElement: HTMLDivElement;
  let plot: uPlot;

  const ranges = ['30m', '1h', '24h', '7d', '30d', '6mo', '12mo', 'all'];

  onMount(() => {
    // refresh stats every 5 seconds
    const interval = setInterval(() => {
      invalidateAll();
    }, 5000);

    const opts: uPlot.Options = {
      title: "",
      width: chartElement.clientWidth,
      height: 400,
      cursor: { show: true },
      scales: {
        x: { time: true },
        y: { range: [0, null] }
      },
      series: [
        {},
        {
          label: "requests",
          stroke: "#f6b012",
          width: 2,
          fill: "rgba(246, 176, 18, 0.1)"
        },
        {
          label: "bandwidth (mb)",
          stroke: "#3c9fdd",
          width: 2,
          scale: "y2",
          fill: "rgba(60, 159, 221, 0.1)"
        }
      ],
      axes: [
        { grid: { stroke: "#222" }, stroke: "#555" },
        { grid: { stroke: "#222" }, stroke: "#555" },
        { side: 3, scale: "y2", grid: { show: false }, stroke: "#555" }
      ]
    };

    const plotData: uPlot.AlignedData = [
      data.analytics.time.map(t => t / 1000), // uPlot expects seconds
      data.analytics.requests,
      data.analytics.bandwidth.map(b => b / (1024 * 1024))
    ];

    plot = new uPlot(opts, plotData, chartElement);
    
    const handleResize = () => plot.setSize({ width: chartElement.clientWidth, height: 400 });
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      plot.destroy();
      window.removeEventListener('resize', handleResize);
    };
  });

  $effect(() => {
    if (plot && data.analytics) {
      const newData: uPlot.AlignedData = [
        data.analytics.time.map(t => t / 1000),
        data.analytics.requests,
        data.analytics.bandwidth.map(b => b / (1024 * 1024))
      ];
      plot.setData(newData);
    }
  });
</script>

<div class="space-y-8">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-3xl font-bold tracking-tight">analytics</h2>
    <div class="flex flex-wrap items-center gap-1 bg-surface p-1 rounded-lg border border-white/5">
      {#each ranges as r}
        <a 
          href="?range={r}"
          class={clsx(
            "px-3 py-1 rounded-md text-xs font-medium transition-all",
            data.range === r ? "bg-accent-yellow text-black" : "text-white/60 hover:text-white"
          )}
        >
          {r}
        </a>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each data.containerStats as container}
      {@const cpu = ((container.stats.cpu_stats.cpu_usage.total_usage - container.stats.precpu_stats.cpu_usage.total_usage) / (container.stats.cpu_stats.system_cpu_usage - container.stats.precpu_stats.system_cpu_usage)) * 100 * (container.stats.cpu_stats.online_cpus || 1)}
      {@const mem = (container.stats.memory_stats.usage / container.stats.memory_stats.limit) * 100}
      {@const memMb = container.stats.memory_stats.usage / (1024 * 1024)}
      <div class="card space-y-4 group hover:border-accent-yellow/20 transition-all">
        <div class="flex items-center justify-between">
          <h3 class="font-bold truncate preserve-case">{container.name}</h3>
          <span class="text-[10px] font-mono text-white/20 uppercase tracking-tighter">{container.id.slice(0, 12)}</span>
        </div>
        
        <div class="space-y-3">
          <div class="space-y-1">
            <div class="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/40">
              <span>cpu usage</span>
              <span class="text-accent-yellow">{cpu.toFixed(1)}%</span>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-accent-yellow transition-all duration-500" style="width: {Math.min(cpu, 100)}%"></div>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/40">
              <span>memory</span>
              <span class="text-accent-blue">{mem.toFixed(1)}% ({memMb.toFixed(1)} mb)</span>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-accent-blue transition-all duration-500" style="width: {mem}%"></div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="card p-0 overflow-hidden">
    <div class="p-4 border-b border-white/5 flex justify-between items-center">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest">system traffic (cloudflared)</p>
    </div>
    <div bind:this={chartElement} class="w-full h-[400px]"></div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="card space-y-4">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest">top paths</p>
      <div class="space-y-2">
        {#each data.analytics.topPaths as path}
          <div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
            <span class="font-mono text-sm preserve-case">{path.path}</span>
            <span class="text-accent-yellow font-bold">{path.count}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="card space-y-4">
      <p class="text-xs font-bold text-white/40 uppercase tracking-widest">summary</p>
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-white/5 rounded-lg border border-white/5">
          <p class="text-xs text-white/40 mb-1">total requests</p>
          <p class="text-2xl font-bold text-accent-yellow">
            {data.analytics.requests.reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div class="p-4 bg-white/5 rounded-lg border border-white/5">
          <p class="text-xs text-white/40 mb-1">total bandwidth</p>
          <p class="text-2xl font-bold text-accent-blue">
            {(data.analytics.bandwidth.reduce((a, b) => a + b, 0) / (1024 * 1024)).toFixed(2)} mb
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.u-legend) {
    color: #fff !important;
  }
</style>

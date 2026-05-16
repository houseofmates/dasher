<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import uPlot from 'uplot';
  import 'uplot/dist/uPlot.min.css';

  let { id, label = 'usage' } = $props();
  let chartElement: HTMLDivElement;
  let plot: uPlot;
  let eventSource: EventSource;

  let data = $state<[number[], number[]]>([[], []]);

  onMount(() => {
    const opts: uPlot.Options = {
      width: chartElement.clientWidth,
      height: 120,
      title: "",
      cursor: {
        show: false
      },
      select: {
        show: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      scales: {
        x: {
          time: true,
        },
        y: {
          range: [0, 100],
        }
      },
      axes: [
        {
          show: false
        },
        {
          grid: { show: true, stroke: "rgba(255,255,255,0.05)" },
          ticks: { show: false },
          values: (self, ticks) => ticks.map(v => v + "%"),
          font: "10px 'Droid Sans Mono'",
          stroke: "rgba(255,255,255,0.2)"
        }
      ],
      series: [
        {},
        {
          label: label,
          stroke: "#f6b012",
          width: 2,
          fill: "rgba(246, 176, 18, 0.1)",
          points: { show: false }
        }
      ]
    };

    plot = new uPlot(opts, [[], []], chartElement);

    eventSource = new EventSource(`/api/containers/${id}/stats`);
    eventSource.onmessage = (event) => {
      const stats = JSON.parse(event.data);
      const now = Math.floor(Date.now() / 1000);
      const value = label === 'cpu' ? parseFloat(stats.cpu) : parseFloat(stats.ram);
      
      const newTimes = [...plot.data[0], now].slice(-60);
      const newValues = [...plot.data[1], value].slice(-60);
      
      plot.setData([newTimes, newValues]);
    };

    window.addEventListener('resize', () => {
      plot.setSize({ width: chartElement.clientWidth, height: 120 });
    });
  });

  onDestroy(() => {
    if (eventSource) eventSource.close();
    if (plot) plot.destroy();
  });
</script>

<div class="w-full h-32 bg-black/20 rounded-lg overflow-hidden border border-white/5">
  <div bind:this={chartElement}></div>
</div>

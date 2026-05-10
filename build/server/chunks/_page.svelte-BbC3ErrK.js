import { R as ensure_array_like, X as attr, U as stringify, T as attr_class, Y as clsx$1, V as escape_html, a2 as attr_style } from './index-server-C4D8vfaK.js';
import './client-CgoAW1aI.js';
import { clsx } from 'clsx';
import 'uplot';
import './internal-CVAmXDyD.js';
import './index-DBqjc0Yf.js';

//#region src/routes/analytics/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const ranges = [
			"30m",
			"1h",
			"24h",
			"7d",
			"30d",
			"6mo",
			"12mo",
			"all"
		];
		$$renderer.push(`<div class="space-y-8"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h2 class="text-3xl font-bold tracking-tight">analytics</h2> <div class="flex flex-wrap items-center gap-1 bg-surface p-1 rounded-lg border border-white/5"><!--[-->`);
		const each_array = ensure_array_like(ranges);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let r = each_array[$$index];
			$$renderer.push(`<a${attr("href", `?range=${stringify(r)}`)}${attr_class(clsx$1(clsx("px-3 py-1 rounded-md text-xs font-medium transition-all", data.range === r ? "bg-accent-yellow text-black" : "text-white/60 hover:text-white")))}>${escape_html(r)}</a>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
		const each_array_1 = ensure_array_like(data.containerStats);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let container = each_array_1[$$index_1];
			const cpu = (container.stats.cpu_stats.cpu_usage.total_usage - container.stats.precpu_stats.cpu_usage.total_usage) / (container.stats.cpu_stats.system_cpu_usage - container.stats.precpu_stats.system_cpu_usage) * 100 * (container.stats.cpu_stats.online_cpus || 1);
			const mem = container.stats.memory_stats.usage / container.stats.memory_stats.limit * 100;
			const memMb = container.stats.memory_stats.usage / (1024 * 1024);
			$$renderer.push(`<div class="card space-y-4 group hover:border-accent-yellow/20 transition-all"><div class="flex items-center justify-between"><h3 class="font-bold truncate preserve-case">${escape_html(container.name)}</h3> <span class="text-[10px] font-mono text-white/20 tracking-tighter">${escape_html(container.id.slice(0, 12))}</span></div> <div class="space-y-3"><div class="space-y-1"><div class="flex justify-between text-[10px] font-bold tracking-widest text-white/40"><span>cpu usage</span> <span class="text-accent-yellow">${escape_html(cpu.toFixed(1))}%</span></div> <div class="h-1.5 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-accent-yellow transition-all duration-500"${attr_style(`width: ${stringify(Math.min(cpu, 100))}%`)}></div></div></div> <div class="space-y-1"><div class="flex justify-between text-[10px] font-bold tracking-widest text-white/40"><span>memory</span> <span class="text-accent-blue">${escape_html(mem.toFixed(1))}% (${escape_html(memMb.toFixed(1))} mb)</span></div> <div class="h-1.5 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-accent-blue transition-all duration-500"${attr_style(`width: ${stringify(mem)}%`)}></div></div></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="card p-0 overflow-hidden"><div class="p-4 border-b border-white/5 flex justify-between items-center"><p class="text-xs font-bold text-white/40 tracking-widest">system traffic (cloudflared)</p></div> <div class="w-full h-[400px]"></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">top paths</p> <div class="space-y-2"><!--[-->`);
		const each_array_2 = ensure_array_like(data.analytics.topPaths);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let path = each_array_2[$$index_2];
			$$renderer.push(`<div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"><span class="font-mono text-sm preserve-case">${escape_html(path.path)}</span> <span class="text-accent-yellow font-bold">${escape_html(path.count)}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">summary</p> <div class="grid grid-cols-2 gap-4"><div class="p-4 bg-white/5 rounded-lg border border-white/5"><p class="text-xs text-white/40 mb-1">total requests</p> <p class="text-2xl font-bold text-accent-yellow">${escape_html(data.analytics.requests.reduce((a, b) => a + b, 0))}</p></div> <div class="p-4 bg-white/5 rounded-lg border border-white/5"><p class="text-xs text-white/40 mb-1">total bandwidth</p> <p class="text-2xl font-bold text-accent-blue">${escape_html((data.analytics.bandwidth.reduce((a, b) => a + b, 0) / (1024 * 1024)).toFixed(2))} mb</p></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BbC3ErrK.js.map

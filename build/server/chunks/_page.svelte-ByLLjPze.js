import { c as escape_html } from './index-server-Ip8I2Crl.js';
import { b as Cube, c as Images, e as HardDrives, G as Globe, P as Pulse } from './lib--dU9BMBy.js';
import 'clsx';

//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="space-y-8"><div class="flex flex-col gap-1"><h2 class="text-3xl font-bold tracking-tight">dashboard</h2> <p class="text-white/40 text-sm">system overview and resource distribution</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><a href="/containers" class="card group hover:border-accent-yellow/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-accent-yellow/10 rounded-xl text-accent-yellow">`);
		Cube($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div> <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">${escape_html(data.stats.containers.running)} running</span></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.containers.total)}</h3> <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">containers</p></div></a> <a href="/images" class="card group hover:border-accent-blue/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">`);
		Images($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.images)}</h3> <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">images</p></div></a> <div class="card group"><div class="flex items-start justify-between"><div class="p-3 bg-purple-500/10 rounded-xl text-purple-500">`);
		HardDrives($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.volumes)}</h3> <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">volumes</p></div></div> <div class="card group"><div class="flex items-start justify-between"><div class="p-3 bg-orange-500/10 rounded-xl text-orange-500">`);
		Globe($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.networks)}</h3> <p class="text-xs text-white/40 uppercase tracking-widest font-bold mt-1">networks</p></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2 space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-bold">recent activity</h3> <button class="text-xs text-white/40 hover:text-white transition-colors">view all</button></div> <div class="card space-y-4 min-h-[300px] flex flex-col items-center justify-center text-white/20 italic">`);
		Pulse($$renderer, {
			size: 48,
			weight: "thin",
			class: "mb-4 opacity-20"
		});
		$$renderer.push(`<!----> no recent events recorded</div></div> <div class="space-y-4"><h3 class="text-lg font-bold">system status</h3> <div class="card space-y-6"><div class="space-y-2"><div class="flex justify-between text-xs"><span class="text-white/60">docker engine</span> <span class="text-green-500 font-bold">healthy</span></div> <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full w-full"></div></div></div> <div class="space-y-2"><div class="flex justify-between text-xs"><span class="text-white/60">api connectivity</span> <span class="text-green-500 font-bold">online</span></div> <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full w-full"></div></div></div> <div class="pt-4 border-t border-white/5"><p class="text-[10px] text-white/20 uppercase font-bold tracking-tighter">node version</p> <p class="text-xs font-mono text-white/40">v22.x (stable)</p></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-ByLLjPze.js.map

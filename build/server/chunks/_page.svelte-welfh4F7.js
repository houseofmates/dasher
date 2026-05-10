import { V as escape_html, T as attr_class, Y as clsx$1, R as ensure_array_like, X as attr, U as stringify, A as derived } from './index-server-C4D8vfaK.js';
import { b as Cube, c as Images, f as HardDrives, G as Globe, g as Funnel, P as Pulse, H as HardDrive, S as ShareNetwork } from './lib-D4dETbbR.js';
import { clsx } from 'clsx';

//#region src/lib/components/RecentActivity.svelte
function RecentActivity($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let events = [];
		let filter = null;
		const filteredEvents = derived(() => events);
		const getActionColor = (action) => {
			if (action.includes("die") || action.includes("kill") || action.includes("stop") || action.includes("delete")) return "text-red-400";
			if (action.includes("start") || action.includes("create")) return "text-green-400";
			if (action.includes("restart")) return "text-accent-blue";
			return "text-white/40";
		};
		const filterTypes = [
			{
				id: "container",
				icon: Cube
			},
			{
				id: "image",
				icon: Images
			},
			{
				id: "volume",
				icon: HardDrive
			},
			{
				id: "network",
				icon: ShareNetwork
			}
		];
		$$renderer.push(`<div class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><h3 class="text-lg font-bold">recent activity</h3> <div class="flex items-center gap-1 bg-surface border border-white/5 p-1 rounded-lg"><button${attr_class(clsx$1(clsx("p-1.5 rounded-md transition-all", "bg-accent-yellow text-black" )))} title="all">`);
		Funnel($$renderer, {
			size: 14,
			weight: "fill" 
		});
		$$renderer.push(`<!----></button> <!--[-->`);
		const each_array = ensure_array_like(filterTypes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let type = each_array[$$index];
			$$renderer.push(`<button${attr_class(clsx$1(clsx("p-1.5 rounded-md transition-all", filter === type.id ? "bg-accent-yellow text-black" : "text-white/40 hover:bg-white/5")))}${attr("title", type.id)}>`);
			if (type.icon) {
				$$renderer.push("<!--[-->");
				type.icon($$renderer, {
					size: 14,
					weight: filter === type.id ? "fill" : "regular"
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <button class="text-xs text-white/40 hover:text-white transition-colors font-bold tracking-widest">clear</button></div> <div class="card min-h-[300px] flex flex-col gap-2 overflow-y-auto max-h-[600px] custom-scrollbar">`);
		if (filteredEvents().length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex-1 flex flex-col items-center justify-center text-white/20 italic p-12">`);
			Pulse($$renderer, {
				size: 48,
				weight: "thin",
				class: "mb-4 opacity-20"
			});
			$$renderer.push(`<!----> <p class="text-sm">no ${escape_html("")} events recorded</p></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(filteredEvents());
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let event = each_array_1[$$index_1];
				$$renderer.push(`<div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group"><div${attr_class(clsx$1(clsx("p-2.5 rounded-lg transition-colors", event.type === "container" ? "bg-accent-yellow/10 text-accent-yellow" : event.type === "image" ? "bg-accent-blue/10 text-accent-blue" : "bg-white/5 text-white/40")))}>`);
				if (event.type === "container") {
					$$renderer.push("<!--[0-->");
					Cube($$renderer, { size: 18 });
				} else if (event.type === "image") {
					$$renderer.push("<!--[1-->");
					Images($$renderer, { size: 18 });
				} else if (event.type === "volume") {
					$$renderer.push("<!--[2-->");
					HardDrive($$renderer, { size: 18 });
				} else if (event.type === "network") {
					$$renderer.push("<!--[3-->");
					ShareNetwork($$renderer, { size: 18 });
				} else {
					$$renderer.push("<!--[-1-->");
					Pulse($$renderer, { size: 18 });
				}
				$$renderer.push(`<!--]--></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><span class="text-sm font-bold truncate preserve-case group-hover:text-white transition-colors">${escape_html(event.actor)}</span> <span${attr_class(`text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 tracking-tighter ${stringify(getActionColor(event.action))} border border-white/5`)}>${escape_html(event.action)}</span></div> <p class="text-[9px] text-white/20 font-bold tracking-[0.2em] mt-1">${escape_html(event.type)}</p></div> <span class="text-[10px] text-white/20 font-mono bg-white/5 px-2 py-1 rounded">${escape_html((/* @__PURE__ */ new Date(event.time * 1e3)).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit"
				}))}</span></div>`);
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="space-y-8"><div class="flex flex-col gap-1"><h2 class="text-3xl font-bold tracking-tight">dashboard</h2> <p class="text-white/40 text-sm">system overview and resource distribution</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><a href="/containers" class="card group hover:border-accent-yellow/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-accent-yellow/10 rounded-xl text-accent-yellow">`);
		Cube($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div> <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">${escape_html(data.stats.containers.running)} running</span></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.containers.total)}</h3> <p class="text-xs text-white/40 tracking-widest font-bold mt-1">containers</p></div></a> <a href="/images" class="card group hover:border-accent-blue/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-accent-blue/10 rounded-xl text-accent-blue">`);
		Images($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.images)}</h3> <p class="text-xs text-white/40 tracking-widest font-bold mt-1">images</p></div></a> <a href="/volumes" class="card group hover:border-purple-500/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-purple-500/10 rounded-xl text-purple-500">`);
		HardDrives($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.volumes)}</h3> <p class="text-xs text-white/40 tracking-widest font-bold mt-1">volumes</p></div></a> <a href="/networks" class="card group hover:border-orange-500/50 transition-all"><div class="flex items-start justify-between"><div class="p-3 bg-orange-500/10 rounded-xl text-orange-500">`);
		Globe($$renderer, {
			size: 24,
			weight: "duotone"
		});
		$$renderer.push(`<!----></div></div> <div class="mt-4"><h3 class="text-3xl font-bold">${escape_html(data.stats.networks)}</h3> <p class="text-xs text-white/40 tracking-widest font-bold mt-1">networks</p></div></a></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2">`);
		RecentActivity($$renderer);
		$$renderer.push(`<!----></div> <div class="space-y-4"><h3 class="text-lg font-bold">system status</h3> <div class="card space-y-6"><div class="space-y-2"><div class="flex justify-between text-xs"><span class="text-white/60">docker engine</span> <span class="text-green-500 font-bold">healthy</span></div> <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full w-full"></div></div></div> <div class="space-y-2"><div class="flex justify-between text-xs"><span class="text-white/60">api connectivity</span> <span class="text-green-500 font-bold">online</span></div> <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden"><div class="bg-green-500 h-full w-full"></div></div></div> <div class="pt-4 border-t border-white/5"><p class="text-[10px] text-white/20 font-bold tracking-tighter">node version</p> <p class="text-xs font-mono text-white/40">v22.x (stable)</p></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-welfh4F7.js.map

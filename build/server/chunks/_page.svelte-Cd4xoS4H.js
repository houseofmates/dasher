import { V as escape_html, R as ensure_array_like, A as derived } from './index-server-C4D8vfaK.js';
import { x as ArrowLeft, h as Trash, S as ShareNetwork, G as Globe, B as ShieldCheck, b as Cube } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import './client-CgoAW1aI.js';
import 'clsx';
import './internal-CVAmXDyD.js';
import './index-DBqjc0Yf.js';

//#region src/routes/networks/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const network = derived(() => data.network);
		$$renderer.push(`<div class="space-y-8 pb-20"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><a href="/networks" class="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">`);
		ArrowLeft($$renderer, { size: 20 });
		$$renderer.push(`<!----></a> <div><h2 class="text-3xl font-bold tracking-tight preserve-case">${escape_html(network().Name)}</h2> <p class="text-white/40 font-mono text-xs mt-1">${escape_html(network().Id.substring(0, 12))}</p></div></div> <button class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold">`);
		Trash($$renderer, { size: 18 });
		$$renderer.push(`<!----> delete network</button></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-1 space-y-6"><div class="card space-y-6"><div class="flex items-center gap-3"><div class="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">`);
		ShareNetwork($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">driver</p> <p class="font-mono text-sm">${escape_html(network().Driver)}</p></div></div> <div class="flex items-center gap-3"><div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow">`);
		Globe($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">scope</p> <p class="font-mono text-sm">${escape_html(network().Scope)}</p></div></div> <div class="flex items-center gap-3"><div class="p-2 bg-accent-green/10 rounded-lg text-accent-green">`);
		ShieldCheck($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">internal</p> <p class="font-mono text-sm">${escape_html(network().Internal ? "yes" : "no")}</p></div></div></div> <div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">ipam config</p> `);
		if (network().IPAM?.Config?.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(network().IPAM.Config);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let config = each_array[$$index];
				$$renderer.push(`<div class="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5"><div class="flex justify-between"><span class="text-[10px] text-white/40">subnet</span> <span class="text-xs font-mono">${escape_html(config.Subnet)}</span></div> <div class="flex justify-between"><span class="text-[10px] text-white/40">gateway</span> <span class="text-xs font-mono">${escape_html(config.Gateway)}</span></div></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="text-xs text-white/20 italic">no ipam configuration</p>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="lg:col-span-2 space-y-6"><div class="card flex-1 flex flex-col gap-4"><p class="text-xs font-bold text-white/40 tracking-widest">connected containers</p> `);
		if (Object.keys(network().Containers || {}).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 gap-3"><!--[-->`);
			const each_array_1 = ensure_array_like(Object.entries(network().Containers || {}));
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let [id, info] = each_array_1[$$index_1];
				$$renderer.push(`<div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all"><div class="flex items-center gap-4"><div class="p-2 bg-white/5 rounded-lg text-white/40">`);
				Cube($$renderer, { size: 20 });
				$$renderer.push(`<!----></div> <div><p class="text-sm font-bold preserve-case">${escape_html(info.Name)}</p> <p class="text-[10px] text-white/20 font-mono">${escape_html(id.substring(0, 12))}</p></div></div> <div class="text-right"><p class="text-xs font-mono text-accent-yellow">${escape_html(info.IPv4Address)}</p> <p class="text-[10px] text-white/20 font-mono">${escape_html(info.MacAddress)}</p></div></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex-1 flex items-center justify-center text-white/10 italic text-sm py-20">no containers connected</div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="card"><p class="text-xs font-bold text-white/40 tracking-widest mb-4">options</p> <div class="grid grid-cols-2 gap-4">`);
		const each_array_2 = ensure_array_like(Object.entries(network().Options || {}));
		if (each_array_2.length !== 0) {
			$$renderer.push("<!--[-->");
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let [key, val] = each_array_2[$$index_2];
				$$renderer.push(`<div class="p-3 bg-black/20 rounded-lg border border-white/5"><p class="text-[9px] text-white/20 font-bold tracking-widest mb-1">${escape_html(key)}</p> <p class="text-xs font-mono text-white/60 truncate">${escape_html(val)}</p></div>`);
			}
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push(`<p class="col-span-2 text-xs text-white/10 italic text-center">no custom options</p>`);
		}
		$$renderer.push(`<!--]--></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cd4xoS4H.js.map

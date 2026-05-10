import { X as attr, R as ensure_array_like, U as stringify, V as escape_html, A as derived } from './index-server-C4D8vfaK.js';
import './client-Cu2AptSW.js';
import { t as MagnifyingGlass, H as HardDrive, w as DotsThreeVertical } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import { C as ContextMenu } from './ContextMenuItem-C2t-QvDN.js';
import 'clsx';
import './internal-WsxKaTee.js';
import './index-DBqjc0Yf.js';

//#region src/routes/volumes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let searchQuery = "";
		const filteredVolumes = derived(() => data.volumes.filter((v) => v.Name.toLowerCase().includes(searchQuery.toLowerCase())));
		let menu = {
			show: false,
			x: 0,
			y: 0};
		$$renderer.push(`<div class="space-y-8"><h2 class="text-3xl font-bold tracking-tight">volumes</h2> <div class="relative">`);
		MagnifyingGlass($$renderer, {
			size: 18,
			class: "absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
		});
		$$renderer.push(`<!----> <input type="text" placeholder="search volumes..." class="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"${attr("value", searchQuery)}/></div> <div class="bento-grid"><!--[-->`);
		const each_array = ensure_array_like(filteredVolumes());
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let volume = each_array[$$index];
			$$renderer.push(`<div class="card group relative flex flex-col justify-between min-h-[200px] border border-white/5 hover:border-accent-yellow/20 transition-all overflow-hidden bg-surface/40 backdrop-blur-md cursor-pointer" role="button" tabindex="0"><div class="relative z-10 flex flex-col h-full justify-between pointer-events-none"><div class="flex items-start justify-between gap-3"><div class="flex items-start gap-3 min-w-0 flex-1"><div class="p-2.5 bg-accent-yellow/10 rounded-xl text-accent-yellow shrink-0 flex items-center justify-center group-hover:bg-accent-yellow/20 transition-all mt-1">`);
			HardDrive($$renderer, {
				size: 22,
				weight: "bold"
			});
			$$renderer.push(`<!----></div> <div class="min-w-0 flex-1"><a${attr("href", `/volumes/${stringify(encodeURIComponent(volume.Name))}`)} class="font-black text-2xl hover:text-accent-yellow transition-colors preserve-case break-words leading-none block tracking-tighter mb-2 pointer-events-auto">${escape_html(volume.Name)}</a></div></div> <div class="text-white/20 group-hover:text-white/40 transition-colors pointer-events-auto shrink-0 pt-1"><button class="p-1 hover:text-white transition-colors">`);
			DotsThreeVertical($$renderer, { size: 20 });
			$$renderer.push(`<!----></button></div></div> <div class="space-y-1.5 mt-4 border-t border-white/5 pt-4"><div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]"><span>driver</span> <span class="text-white/60">${escape_html(volume.Driver)}</span></div> <div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]"><span>mount</span> <span class="text-white/60 truncate max-w-[150px]">${escape_html(volume.Mountpoint.split("/").pop() || "external")}</span></div></div></div></div>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		ContextMenu($$renderer, {
			show: menu.show,
			x: menu.x,
			y: menu.y,
			onClose: () => menu.show = false,
			children: ($$renderer) => {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}});
		$$renderer.push(`<!---->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CF9QyzhS.js.map

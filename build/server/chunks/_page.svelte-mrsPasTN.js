import { R as ensure_array_like, T as attr_class, Y as clsx$1, V as escape_html, X as attr, U as stringify, A as derived } from './index-server-C4D8vfaK.js';
import './client-K4SNEuXn.js';
import { v as DotsSixVertical, A as ArrowClockwise, r as Play, s as Stop, w as DotsThreeVertical } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import { C as ContextMenu } from './ContextMenuItem-CjOThxT_.js';
import { clsx } from 'clsx';
import './internal-XfEYWJNS.js';
import './index-DBqjc0Yf.js';

//#region node_modules/svelte-dnd-action/dist/index.mjs
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
_defineProperty({}, Object.freeze({ USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT" }).USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs$1 = {
	DND_ZONE_ACTIVE: "dnd-zone-active",
	DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list");
//#endregion
//#region src/routes/containers/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let containers = [];
		let filter = "all";
		let searchQuery = "";
		const filteredContainers = derived(() => containers.filter((c) => {
			const name = (c.name || "").toLowerCase();
			const image = (c.image || "").toLowerCase();
			const matchesSearch = name.includes(searchQuery.toLowerCase()) || image.includes(searchQuery.toLowerCase());
			const matchesFilter = filter === "all";
			return matchesSearch && matchesFilter;
		}));
		let loadingAction = null;
		let menu = {
			show: false,
			x: 0,
			y: 0};
		$$renderer.push(`<div class="space-y-8"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h2 class="text-3xl font-bold tracking-tight">containers</h2> <div class="flex items-center gap-2 bg-surface p-1 rounded-lg border border-white/5"><!--[-->`);
		const each_array = ensure_array_like([
			"all",
			"running",
			"stopped",
			"errored"
		]);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let f = each_array[$$index];
			$$renderer.push(`<button${attr_class(clsx$1(clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-all lowercase", filter === f ? "bg-accent-yellow text-black" : "text-white/60 hover:text-white")))}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="relative"><input type="text" placeholder="search containers..." class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"${attr("value", searchQuery)}/></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"><!--[-->`);
		const each_array_1 = ensure_array_like(filteredContainers());
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let container = each_array_1[$$index_2];
			$$renderer.push(`<div class="card group relative flex flex-col justify-between min-h-[200px] border border-white/5 hover:border-accent-yellow/20 transition-all overflow-hidden bg-surface/40 backdrop-blur-md cursor-pointer" role="button" tabindex="0"><div class="flex items-start justify-between gap-3"><div class="flex items-start gap-3 min-w-0 flex-1"><div${attr_class(clsx$1(clsx("w-2 h-2 rounded-full mt-2.5 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.5)]", container.state === "running" ? "bg-green-500 shadow-green-500/20" : container.state === "exited" ? "bg-white/20" : "bg-red-500 shadow-red-500/20")))}></div> <div class="min-w-0 flex-1"><a${attr("href", `/containers/${stringify(container.id)}`)} class="font-black text-2xl hover:text-accent-yellow transition-colors preserve-case break-words leading-none block tracking-tighter mb-2">${escape_html(container.name.replace(/^\//, ""))}</a> <p class="text-[10px] text-white/40 font-mono tracking-tight truncate opacity-70 group-hover:opacity-100 transition-opacity bg-white/5 px-2 py-0.5 rounded w-fit border border-white/5">${escape_html(container.image)}</p></div></div> <div class="cursor-grab active:cursor-grabbing text-white/10 hover:text-white/30 transition-colors shrink-0 pt-1">`);
			DotsSixVertical($$renderer, { size: 16 });
			$$renderer.push(`<!----></div></div> <div class="space-y-1.5 mt-4"><div class="flex items-center justify-between text-[9px] text-white/30 font-mono tracking-[0.2em]"><span>status</span> <span${attr_class(clsx$1(clsx(container.state === "running" ? "text-green-400" : "text-white/30")))}>${escape_html(container.status)}</span></div> `);
			if (container.ports && container.ports.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-wrap gap-1 mt-2"><!--[-->`);
				const each_array_2 = ensure_array_like(container.ports.slice(0, 4));
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let port = each_array_2[$$index_1];
					$$renderer.push(`<span class="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/50 border border-white/5">${escape_html(port.PublicPort ? `${port.PublicPort}:${port.PrivatePort}` : port.PrivatePort)}</span>`);
				}
				$$renderer.push(`<!--]--> `);
				if (container.ports.length > 4) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-[10px] text-white/20">+${escape_html(container.ports.length - 4)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-end gap-1 mt-6 border-t border-white/5 pt-3 -mx-2 px-2">`);
			if (loadingAction === container.id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-2 animate-spin text-accent-yellow">`);
				ArrowClockwise($$renderer, { size: 18 });
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				if (container.state !== "running") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button class="p-2 text-white/20 hover:text-green-500 transition-colors" title="start">`);
					Play($$renderer, {
						size: 18,
						weight: "fill"
					});
					$$renderer.push(`<!----></button>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button class="p-2 text-white/20 hover:text-red-500 transition-colors" title="stop">`);
					Stop($$renderer, {
						size: 18,
						weight: "fill"
					});
					$$renderer.push(`<!----></button> <button class="p-2 text-white/20 hover:text-accent-blue transition-colors" title="restart">`);
					ArrowClockwise($$renderer, { size: 18 });
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]--> <button class="p-2 text-white/20 hover:text-white transition-colors">`);
				DotsThreeVertical($$renderer, { size: 18 });
				$$renderer.push(`<!----></button>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
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
//# sourceMappingURL=_page.svelte-mrsPasTN.js.map

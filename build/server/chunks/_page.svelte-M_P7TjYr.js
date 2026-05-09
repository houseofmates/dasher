import { e as ensure_array_like, a as attr_class, g as clsx$1, c as escape_html, f as attr, b as stringify, K as derived } from './index-server-Ip8I2Crl.js';
import './client-B-1rA_pX.js';
import { o as DotsSixVertical, A as ArrowClockwise, j as Play, k as Stop, p as DotsThreeVertical } from './lib--dU9BMBy.js';
import './toast-CcsTuW86.js';
import { C as ContextMenu } from './ContextMenuItem-BAuBikxI.js';
import { clsx } from 'clsx';
import './internal-GnTtL5YM.js';
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
			$$renderer.push(`<button${attr_class(clsx$1(clsx("px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize", filter === f ? "bg-accent-yellow text-black" : "text-white/60 hover:text-white")))}>${escape_html(f)}</button>`);
		}
		$$renderer.push(`<!--]--></div></div> <div class="relative"><input type="text" placeholder="search containers..." class="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"${attr("value", searchQuery)}/></div> <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"><!--[-->`);
		const each_array_1 = ensure_array_like(filteredContainers());
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let container = each_array_1[$$index_2];
			$$renderer.push(`<div class="card group relative flex flex-col justify-between h-48 border border-white/5 hover:border-white/10 transition-all overflow-hidden"><div class="flex items-start justify-between"><div class="flex items-start gap-3"><div${attr_class(clsx$1(clsx("w-2 h-2 rounded-full mt-2.5 shrink-0", container.state === "running" ? "bg-green-500" : container.state === "exited" ? "bg-white/20" : "bg-red-500")))}></div> <div class="overflow-hidden"><a${attr("href", `/containers/${stringify(container.id)}`)} class="font-bold text-lg hover:text-accent-yellow transition-colors preserve-case truncate block">${escape_html(container.name.replace(/^\//, ""))}</a> <p class="text-[10px] text-white/30 font-mono mt-0.5 tracking-tight truncate">${escape_html(container.image)}</p></div></div> <div class="cursor-grab active:cursor-grabbing text-white/10 hover:text-white/30 transition-colors opacity-0 group-hover:opacity-100">`);
			DotsSixVertical($$renderer, { size: 18 });
			$$renderer.push(`<!----></div></div> <div class="space-y-1"><div class="flex items-center justify-between text-[10px] text-white/40 font-mono uppercase tracking-widest"><span>status</span> <span${attr_class(clsx$1(clsx(container.state === "running" ? "text-green-400" : "text-white/40")))}>${escape_html(container.status)}</span></div> `);
			if (container.ports && container.ports.length > 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex flex-wrap gap-1 mt-2"><!--[-->`);
				const each_array_2 = ensure_array_like(container.ports.slice(0, 3));
				for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
					let port = each_array_2[$$index_1];
					$$renderer.push(`<span class="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/60">${escape_html(port.PublicPort ? `${port.PublicPort}:${port.PrivatePort}` : port.PrivatePort)}</span>`);
				}
				$$renderer.push(`<!--]--> `);
				if (container.ports.length > 3) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-[10px] text-white/20">+${escape_html(container.ports.length - 3)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="flex items-center justify-end gap-1 mt-4 border-t border-white/5 pt-3">`);
			if (loadingAction === container.id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="p-2 animate-spin text-accent-yellow">`);
				ArrowClockwise($$renderer, { size: 18 });
				$$renderer.push(`<!----></div>`);
			} else {
				$$renderer.push("<!--[-1-->");
				if (container.state !== "running") {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<button class="p-2 hover:text-green-500 transition-colors" title="start">`);
					Play($$renderer, {
						size: 18,
						weight: "fill"
					});
					$$renderer.push(`<!----></button>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button class="p-2 hover:text-red-500 transition-colors" title="stop">`);
					Stop($$renderer, {
						size: 18,
						weight: "fill"
					});
					$$renderer.push(`<!----></button> <button class="p-2 hover:text-accent-blue transition-colors" title="restart">`);
					ArrowClockwise($$renderer, { size: 18 });
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]--> <button class="p-2 hover:text-white/60 transition-colors">`);
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
//# sourceMappingURL=_page.svelte-M_P7TjYr.js.map

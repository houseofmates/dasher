import { f as attr, e as ensure_array_like, c as escape_html, a2 as attr_style, b as stringify, K as derived } from './index-server-Ip8I2Crl.js';
import './client-B-1rA_pX.js';
import { m as MagnifyingGlass, D as Download, i as CircleNotch, p as DotsThreeVertical } from './lib--dU9BMBy.js';
import './toast-CcsTuW86.js';
import { C as ContextMenu } from './ContextMenuItem-BAuBikxI.js';
import 'clsx';
import './internal-GnTtL5YM.js';
import './index-DBqjc0Yf.js';

//#region src/routes/images/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let searchQuery = "";
		let newImage = "";
		const filteredImages = derived(() => data.images.filter((img) => img.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))));
		function formatSize(bytes) {
			const mb = bytes / (1024 * 1024);
			return mb > 1024 ? `${(mb / 1024).toFixed(2)} gb` : `${mb.toFixed(2)} mb`;
		}
		let pullProgress = [];
		let menu = {
			show: false,
			x: 0,
			y: 0};
		$$renderer.push(`<div class="space-y-8"><div class="flex items-center justify-between"><h2 class="text-3xl font-bold tracking-tight">images</h2></div> <div class="flex gap-4"><div class="relative flex-1">`);
		MagnifyingGlass($$renderer, {
			size: 18,
			class: "absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
		});
		$$renderer.push(`<!----> <input type="text" placeholder="search images..." class="w-full bg-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case"${attr("value", searchQuery)}/></div> <div class="flex gap-2"><input type="text" placeholder="pull image (e.g. nginx:latest)" class="bg-surface border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-yellow transition-all preserve-case w-64"${attr("value", newImage)}/> <button class="btn-primary flex items-center gap-2 min-w-[100px] justify-center"${attr("disabled", true, true)}>`);
		$$renderer.push("<!--[-1-->");
		Download($$renderer, { size: 20 });
		$$renderer.push(`<!----> pull`);
		$$renderer.push(`<!--]--></button></div></div> `);
		if (pullProgress.length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="card bg-black/40 border-accent-yellow/20 space-y-3"><div class="flex items-center justify-between"><p class="text-xs font-bold text-accent-yellow uppercase tracking-widest">pulling progress</p> `);
			CircleNotch($$renderer, {
				size: 14,
				class: "animate-spin text-accent-yellow"
			});
			$$renderer.push(`<!----></div> <div class="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar"><!--[-->`);
			const each_array = ensure_array_like(pullProgress);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let p = each_array[$$index];
				$$renderer.push(`<div class="flex flex-col gap-1"><div class="flex justify-between text-[10px] font-mono"><span class="text-white/40">${escape_html(p.id || "system")}</span> <span class="text-white/60">${escape_html(p.status)}</span></div> `);
				if (p.progressDetail?.current) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-accent-yellow transition-all duration-300"${attr_style(`width: ${stringify(p.progressDetail.current / p.progressDetail.total * 100)}%`)}></div></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			}
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="bento-grid"><!--[-->`);
		const each_array_1 = ensure_array_like(filteredImages());
		for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
			let img = each_array_1[$$index_2];
			$$renderer.push(`<div class="card group relative flex flex-col justify-between hover:border-white/20 transition-all cursor-pointer"><a${attr("href", `/images/${stringify(img.id)}`)} class="absolute inset-0 z-0"></a> <div class="relative z-10 space-y-4 pointer-events-none"><div class="flex justify-between items-start"><div class="space-y-1 overflow-hidden pr-8"><!--[-->`);
			const each_array_2 = ensure_array_like(img.tags);
			for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
				let tag = each_array_2[$$index_1];
				$$renderer.push(`<p class="font-bold text-lg leading-tight truncate preserve-case"${attr("title", tag)}>${escape_html(tag)}</p>`);
			}
			$$renderer.push(`<!--]--> <p class="text-[10px] text-white/20 font-mono truncate uppercase tracking-tighter">${escape_html(img.id.replace("sha256:", "").slice(0, 12))}</p></div> <div class="text-white/20 group-hover:text-white/40 transition-colors pointer-events-auto"><button class="p-1 hover:text-white">`);
			DotsThreeVertical($$renderer, { size: 20 });
			$$renderer.push(`<!----></button></div></div> <div class="flex justify-between items-center text-[10px] text-white/40 font-mono uppercase tracking-widest pt-4 border-t border-white/5"><span>${escape_html(formatSize(img.size))}</span> <span>${escape_html((/* @__PURE__ */ new Date(img.created * 1e3)).toLocaleDateString())}</span></div></div></div>`);
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
//# sourceMappingURL=_page.svelte-C8bqyljr.js.map

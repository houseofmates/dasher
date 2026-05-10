import { V as escape_html, R as ensure_array_like, A as derived } from './index-server-C4D8vfaK.js';
import { x as ArrowLeft, h as Trash, H as HardDrive, K as Calendar, L as Database } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import './client-K4SNEuXn.js';
import 'clsx';
import './internal-XfEYWJNS.js';
import './index-DBqjc0Yf.js';

//#region src/routes/volumes/[name]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const volume = derived(() => data.volume);
		function formatDate(dateStr) {
			return new Date(dateStr).toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		$$renderer.push(`<div class="space-y-8 pb-20"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><a href="/volumes" class="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">`);
		ArrowLeft($$renderer, { size: 20 });
		$$renderer.push(`<!----></a> <div><h2 class="text-3xl font-bold tracking-tight preserve-case">${escape_html(volume().Name)}</h2> <p class="text-white/40 font-mono text-xs mt-1">volume inspection</p></div></div> <button class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold">`);
		Trash($$renderer, { size: 18 });
		$$renderer.push(`<!----> delete volume</button></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-1 space-y-6"><div class="card space-y-6"><div class="flex items-center gap-3"><div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow">`);
		HardDrive($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">driver</p> <p class="font-mono text-sm">${escape_html(volume().Driver)}</p></div></div> <div class="flex items-center gap-3"><div class="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">`);
		Calendar($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">created</p> <p class="font-mono text-sm">${escape_html(volume().CreatedAt ? formatDate(volume().CreatedAt) : "n/a")}</p></div></div> <div class="flex items-center gap-3"><div class="p-2 bg-accent-green/10 rounded-lg text-accent-green">`);
		Database($$renderer, { size: 24 });
		$$renderer.push(`<!----></div> <div><p class="text-[10px] text-white/20 font-bold tracking-widest">scope</p> <p class="font-mono text-sm">${escape_html(volume().Scope)}</p></div></div></div> <div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">mountpoint</p> <div class="bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-xs break-all leading-relaxed">${escape_html(volume().Mountpoint)}</div></div></div> <div class="lg:col-span-2 space-y-6"><div class="card h-full flex flex-col gap-4 min-h-[400px]"><div class="flex items-center justify-between"><p class="text-xs font-bold text-white/40 tracking-widest">labels &amp; options</p></div> `);
		if (Object.keys(volume().Labels || {}).length > 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 gap-2"><!--[-->`);
			const each_array = ensure_array_like(Object.entries(volume().Labels || {}));
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let [key, val] = each_array[$$index];
				$$renderer.push(`<div class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"><span class="text-xs font-bold text-white/60 font-mono">${escape_html(key)}</span> <span class="text-xs text-accent-yellow/80 font-mono truncate max-w-[200px]">${escape_html(val)}</span></div>`);
			}
			$$renderer.push(`<!--]--></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="flex-1 flex items-center justify-center text-white/10 italic text-sm">no labels defined</div>`);
		}
		$$renderer.push(`<!--]--> <div class="mt-auto pt-6 border-t border-white/5"><p class="text-[10px] text-white/20 font-bold tracking-widest mb-4">raw configuration</p> <div class="bg-black/40 p-4 rounded-xl font-mono text-[10px] text-white/60 overflow-x-auto whitespace-pre">${escape_html(JSON.stringify(volume(), null, 2))}</div></div></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D4jHWy02.js.map

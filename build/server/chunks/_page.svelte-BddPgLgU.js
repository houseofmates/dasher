import { R as ensure_array_like, V as escape_html, A as derived } from './index-server-C4D8vfaK.js';
import { x as ArrowLeft, h as Trash, I as Info, z as Tag } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import './client-K4SNEuXn.js';
import 'clsx';
import './internal-XfEYWJNS.js';
import './index-DBqjc0Yf.js';

//#region src/routes/images/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const image = derived(() => data.image);
		function formatSize(bytes) {
			const mb = bytes / (1024 * 1024);
			return mb > 1024 ? `${(mb / 1024).toFixed(2)} gb` : `${mb.toFixed(2)} mb`;
		}
		$$renderer.push(`<div class="space-y-8"><div class="flex items-center gap-4"><a href="/images" class="p-2 hover:bg-white/5 rounded-lg transition-colors">`);
		ArrowLeft($$renderer, { size: 24 });
		$$renderer.push(`<!----></a> <h2 class="text-3xl font-bold tracking-tight">image details</h2></div> `);
		if (image()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="card space-y-6"><div class="flex items-center justify-between"><h3 class="text-xl font-bold">tags</h3> <button class="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 text-sm">`);
			Trash($$renderer, { size: 18 });
			$$renderer.push(`<!----> delete image</button></div> <div class="flex flex-wrap gap-2"><!--[-->`);
			const each_array = ensure_array_like(image().RepoTags || []);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let tag = each_array[$$index];
				$$renderer.push(`<span class="px-3 py-1 bg-accent-yellow/10 text-accent-yellow rounded-full text-sm font-medium border border-accent-yellow/20">${escape_html(tag)}</span>`);
			}
			$$renderer.push(`<!--]--></div></div> <div class="card space-y-4"><h3 class="text-xl font-bold">configuration</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-1"><p class="text-[10px] text-white/40 tracking-widest font-bold">architecture</p> <p class="font-mono text-sm">${escape_html(image().Architecture)}</p></div> <div class="space-y-1"><p class="text-[10px] text-white/40 tracking-widest font-bold">os</p> <p class="font-mono text-sm">${escape_html(image().Os)}</p></div> <div class="space-y-1"><p class="text-[10px] text-white/40 tracking-widest font-bold">docker version</p> <p class="font-mono text-sm">${escape_html(image().DockerVersion)}</p></div> <div class="space-y-1"><p class="text-[10px] text-white/40 tracking-widest font-bold">author</p> <p class="font-mono text-sm truncate">${escape_html(image().Author || "N/A")}</p></div></div></div> `);
			if (image().Config && image().Config.Env) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card space-y-4"><h3 class="text-xl font-bold">environment variables</h3> <div class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar"><!--[-->`);
				const each_array_1 = ensure_array_like(image().Config.Env);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let env = each_array_1[$$index_1];
					$$renderer.push(`<div class="p-3 bg-black/20 border border-white/5 rounded-lg font-mono text-xs break-all">${escape_html(env)}</div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="space-y-6"><div class="card space-y-4"><div class="flex items-center gap-3 text-accent-yellow">`);
			Info($$renderer, { size: 20 });
			$$renderer.push(`<!----> <span class="font-bold text-xs tracking-widest">quick info</span></div> <div class="space-y-4 pt-2"><div class="flex justify-between items-center"><span class="text-white/40 text-sm">Size</span> <span class="font-mono">${escape_html(formatSize(image().Size))}</span></div> <div class="flex justify-between items-center"><span class="text-white/40 text-sm">Created</span> <span class="font-mono">${escape_html(new Date(image().Created).toLocaleDateString())}</span></div> <div class="flex justify-between items-center"><span class="text-white/40 text-sm">Layers</span> <span class="font-mono">${escape_html(image().RootFS?.Layers?.length || 0)}</span></div></div></div> `);
			if (image().Config && image().Config.ExposedPorts) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="card space-y-4"><div class="flex items-center gap-3 text-accent-blue">`);
				Tag($$renderer, { size: 20 });
				$$renderer.push(`<!----> <span class="font-bold text-xs tracking-widest">exposed ports</span></div> <div class="flex flex-wrap gap-2 pt-2"><!--[-->`);
				const each_array_2 = ensure_array_like(Object.keys(image().Config.ExposedPorts));
				for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
					let port = each_array_2[$$index_2];
					$$renderer.push(`<span class="px-2 py-1 bg-white/5 rounded text-xs font-mono">${escape_html(port)}</span>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BddPgLgU.js.map

import { a4 as onDestroy, V as escape_html, X as attr, U as stringify, R as ensure_array_like } from './index-server-C4D8vfaK.js';
import { x as ArrowLeft, h as Trash, r as Play, s as Stop, A as ArrowClockwise, y as Terminal } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import './client-K4SNEuXn.js';
import 'clsx';
import 'uplot';
import './internal-XfEYWJNS.js';
import './index-DBqjc0Yf.js';

//#region src/lib/components/StatsChart.svelte
function StatsChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { id, label = "usage" } = $$props;
		onDestroy(() => {});
		$$renderer.push(`<div class="w-full h-32 bg-black/20 rounded-lg overflow-hidden border border-white/5"><div></div></div>`);
	});
}
//#endregion
//#region src/routes/containers/[id]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let logs = [];
		onDestroy(() => {});
		let loadingAction = null;
		$$renderer.push(`<div class="space-y-6 pb-20"><div class="flex items-center justify-between gap-4"><div class="flex items-center gap-4"><a href="/containers" class="p-2 hover:bg-white/5 rounded-lg transition-all">`);
		ArrowLeft($$renderer, { size: 24 });
		$$renderer.push(`<!----></a> <div><h2 class="text-3xl font-bold tracking-tight preserve-case">${escape_html(data.container.name)}</h2> <p class="text-xs text-white/40 font-mono mt-0.5">${escape_html(data.container.id.substring(0, 12))}</p></div></div> <button class="p-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"${attr("disabled", loadingAction === "remove", true)}>`);
		{
			$$renderer.push("<!--[-1-->");
			Trash($$renderer, { size: 24 });
		}
		$$renderer.push(`<!--]--></button></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-2 card space-y-6"><div><p class="text-xs font-bold text-white/40 tracking-widest mb-4">resource usage</p> <div class="h-64 bg-black/20 rounded-xl overflow-hidden border border-white/5">`);
		StatsChart($$renderer, { containerId: data.container.id });
		$$renderer.push(`<!----></div></div></div> <div class="space-y-6"><div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">quick actions</p> <div class="grid grid-cols-2 gap-3">`);
		if (data.container.state !== "running") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<button class="btn-primary flex items-center justify-center gap-2 py-3"${attr("disabled", loadingAction !== null, true)}>`);
			{
				$$renderer.push("<!--[-1-->");
				Play($$renderer, {
					size: 18,
					weight: "fill"
				});
				$$renderer.push(`<!----> start`);
			}
			$$renderer.push(`<!--]--></button>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button class="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 py-3 transition-all"${attr("disabled", loadingAction !== null, true)}>`);
			{
				$$renderer.push("<!--[-1-->");
				Stop($$renderer, {
					size: 18,
					weight: "fill"
				});
				$$renderer.push(`<!----> stop`);
			}
			$$renderer.push(`<!--]--></button>`);
		}
		$$renderer.push(`<!--]--> <button class="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl flex items-center justify-center gap-2 py-3 transition-all"${attr("disabled", loadingAction !== null, true)}>`);
		{
			$$renderer.push("<!--[-1-->");
			ArrowClockwise($$renderer, { size: 18 });
			$$renderer.push(`<!----> restart`);
		}
		$$renderer.push(`<!--]--></button></div> <a${attr("href", `/terminal?id=${stringify(data.container.id)}`)} class="btn-secondary w-full flex items-center gap-3 justify-center">`);
		Terminal($$renderer, { size: 20 });
		$$renderer.push(`<!----> exec</a></div></div> <div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">cpu usage</p> `);
		StatsChart($$renderer, {
			id: data.container.id,
			label: "cpu"
		});
		$$renderer.push(`<!----></div> <div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">memory usage</p> `);
		StatsChart($$renderer, {
			id: data.container.id,
			label: "ram"
		});
		$$renderer.push(`<!----></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="card space-y-6"><div><p class="text-xs font-bold text-white/40 tracking-widest mb-3">environment</p> <div class="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar svelte-1a87x95"><!--[-->`);
		const each_array = ensure_array_like(data.container.env);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let env = each_array[$$index];
			$$renderer.push(`<div class="flex items-center gap-2 text-xs font-mono bg-black/30 p-2 rounded border border-white/5"><span class="text-accent-yellow">${escape_html(env.split("=")[0])}=</span> <span class="text-white/60 truncate">${escape_html(env.split("=")[1])}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div> <div><p class="text-xs font-bold text-white/40 tracking-widest mb-3">ports</p> <div class="space-y-2"><!--[-->`);
		const each_array_1 = ensure_array_like(Object.entries(data.container.ports || {}));
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let [port, bindings] = each_array_1[$$index_1];
			$$renderer.push(`<div class="flex items-center justify-between text-xs font-mono bg-black/30 p-2 rounded border border-white/5"><span class="text-white/40">${escape_html(port)}</span> <span class="text-accent-blue">${escape_html(bindings ? bindings.map((b) => `${b.HostIp}:${b.HostPort}`).join(", ") : "none")}</span></div>`);
		}
		$$renderer.push(`<!--]--></div></div></div> <div class="card flex flex-col h-[500px]"><p class="text-xs font-bold text-white/40 tracking-widest mb-4">live logs</p> <div class="flex-1 bg-black/50 rounded-lg p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar svelte-1a87x95"><!--[-->`);
		const each_array_2 = ensure_array_like(logs);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let log = each_array_2[$$index_2];
			$$renderer.push(`<div class="whitespace-pre-wrap mb-1 text-white/70">${escape_html(log)}</div>`);
		}
		$$renderer.push(`<!--]--> `);
		if (logs.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-white/20 italic">waiting for logs...</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DlFwbPXE.js.map

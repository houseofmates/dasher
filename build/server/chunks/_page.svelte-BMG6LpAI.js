import { V as escape_html, X as attr, T as attr_class, Y as clsx$1, R as ensure_array_like, a4 as onDestroy, a5 as bind_props, A as derived } from './index-server-C4D8vfaK.js';
import { m as Code, n as CaretDown, o as Copy, M as MagicWand, p as FloppyDisk, q as CircleNotch, r as Play, s as Stop, D as Download, t as MagnifyingGlass, u as Plus } from './lib-D4dETbbR.js';
import './toast-aIxD4KVa.js';
import { clsx } from 'clsx';
import 'codemirror';
import '@codemirror/lang-yaml';
import '@codemirror/state';
import '@codemirror/theme-one-dark';

//#region src/lib/components/Editor.svelte
function Editor($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { value = "", readonly = false } = $$props;
		onDestroy(() => {});
		$$renderer.push(`<div class="h-full w-full rounded-2xl overflow-hidden border border-white/5 bg-surface/40 backdrop-blur-md transition-all focus-within:border-white/20"></div>`);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/snippets.ts
var snippets = [
	{
		name: "nginx service",
		description: "basic nginx web server",
		content: `  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    restart: always`
	},
	{
		name: "redis service",
		description: "redis in-memory data store",
		content: `  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: always`
	},
	{
		name: "postgres service",
		description: "postgresql database with volume",
		content: `  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: always

volumes:
  db_data:`
	},
	{
		name: "mariadb service",
		description: "mariadb database",
		content: `  mariadb:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - db_data:/var/lib/mysql
    restart: always

volumes:
  db_data:`
	},
	{
		name: "nvidia gpu runtime",
		description: "service with gpu access",
		content: `  gpu-app:
    image: my-gpu-app:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]`
	}
];
//#endregion
//#region src/routes/compose/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let yamlContent = "";
		let saving = false;
		let executionOutput = [];
		let isExecuting = false;
		let snippetSearch = "";
		const filteredSnippets = derived(() => snippets.filter((s) => s.name.toLowerCase().includes(snippetSearch.toLowerCase()) || s.description.toLowerCase().includes(snippetSearch.toLowerCase())));
		let showStackSelector = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div class="h-[calc(100dvh-200px)] flex flex-col gap-6"><div class="flex items-center justify-between"><div class="flex items-center gap-6"><h2 class="text-3xl font-bold tracking-tight">compose</h2> <div class="relative"><button class="flex items-center bg-surface border border-white/10 rounded-xl px-5 py-3 text-sm min-w-[360px] hover:border-white/20 transition-all shadow-lg group relative"><div class="flex items-center gap-4 w-full"><div class="w-10 h-10 bg-accent-yellow/10 rounded-xl text-accent-yellow shrink-0 flex items-center justify-center group-hover:bg-accent-yellow/20 transition-all">`);
			Code($$renderer, {
				size: 22,
				weight: "bold"
			});
			$$renderer.push(`<!----></div> <div class="flex-1 flex flex-col items-start min-w-0"><span class="text-[10px] text-white/20 font-bold tracking-[0.2em] leading-none mb-1">active stack</span> <span class="font-bold truncate preserve-case text-white text-lg leading-tight w-full text-left">${escape_html("select stack")}</span></div> <div class="shrink-0 w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">`);
			CaretDown($$renderer, {
				size: 14,
				class: clsx("transition-transform text-white/40 group-hover:text-white", showStackSelector)
			});
			$$renderer.push(`<!----></div></div></button> `);
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div></div> <div class="flex items-center gap-2"><button class="bg-surface/40 hover:bg-surface/60 border border-white/5 p-2.5 rounded-lg transition-colors relative" title="copy yaml">`);
			$$renderer.push("<!--[-1-->");
			Copy($$renderer, {
				size: 18,
				class: "text-white/40"
			});
			$$renderer.push(`<!--]--></button> <button class="btn-secondary flex items-center gap-2 text-xs py-2.5" style="color: #050505;">`);
			MagicWand($$renderer, { size: 16 });
			$$renderer.push(`<!----> ai fix</button> <button class="btn-primary flex items-center gap-2 text-xs min-w-[100px] justify-center py-2.5"${attr("disabled", saving, true)}>`);
			$$renderer.push("<!--[-1-->");
			FloppyDisk($$renderer, { size: 16 });
			$$renderer.push(`<!----> save`);
			$$renderer.push(`<!--]--></button></div></div> <div class="flex-1 min-h-0 flex gap-6"><div class="flex-1 flex flex-col gap-4 min-h-0"><div class="flex-1 min-h-0 relative"><div${attr_class(clsx$1(clsx("absolute inset-0 z-10 bg-surface/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 pointer-events-none rounded-xl", "opacity-0")), "svelte-16dnk2j")}><div class="flex flex-col items-center gap-2">`);
			CircleNotch($$renderer, {
				size: 32,
				class: "animate-spin text-accent-yellow"
			});
			$$renderer.push(`<!----> <span class="text-xs text-white/40 font-bold tracking-widest">loading stack...</span></div></div> <!---->`);
			Editor($$renderer, {
				get value() {
					return yamlContent;
				},
				set value($$value) {
					yamlContent = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div> `);
			if (executionOutput.length > 0 || isExecuting) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="h-48 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1 scroll-smooth"><div class="flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-md -m-4 mb-2 p-2 px-4 border-b border-white/5 z-10"><span class="text-white/20 tracking-widest text-[9px] font-bold">execution output</span> <button class="text-white/20 hover:text-white text-[10px] font-bold tracking-tighter">clear</button></div> <!--[-->`);
				const each_array_1 = ensure_array_like(executionOutput);
				for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
					let line = each_array_1[$$index_1];
					$$renderer.push(`<div${attr_class(clsx$1(clsx("whitespace-pre-wrap py-0.5", line.type === "stderr" || line.type === "error" ? "text-red-400/90" : "text-accent-yellow/70", line.type === "exit" && "text-white font-bold border-t border-white/5 mt-2 pt-2")), "svelte-16dnk2j")}>`);
					if (line.type === "exit") {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<span class="opacity-50">#</span> process exited with code ${escape_html(line.code)}`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`${escape_html(line.text)}`);
					}
					$$renderer.push(`<!--]--></div>`);
				}
				$$renderer.push(`<!--]--> `);
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <div class="w-72 space-y-4 shrink-0 flex flex-col"><div class="card space-y-4"><p class="text-xs font-bold text-white/40 tracking-widest">stack actions</p> <div class="grid grid-cols-1 gap-2"><button class="w-full btn-primary flex items-center gap-3 justify-center py-3"${attr("disabled", isExecuting, true)}>`);
			Play($$renderer, {
				size: 20,
				weight: "fill"
			});
			$$renderer.push(`<!----> up</button> <button class="w-full border border-white/10 hover:bg-white/5 px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center"${attr("disabled", isExecuting, true)}>`);
			Stop($$renderer, {
				size: 20,
				weight: "fill"
			});
			$$renderer.push(`<!----> down</button> <button class="w-full border border-white/10 hover:bg-white/5 px-4 py-3 rounded-md transition-all flex items-center gap-3 justify-center"${attr("disabled", isExecuting, true)}>`);
			Download($$renderer, { size: 20 });
			$$renderer.push(`<!----> pull</button></div></div> <div class="card flex-1 flex flex-col min-h-0 gap-4"><div class="flex items-center justify-between"><p class="text-xs font-bold text-white/40 tracking-widest">snippets</p> `);
			Code($$renderer, {
				size: 16,
				class: "text-white/20"
			});
			$$renderer.push(`<!----></div> <div class="relative">`);
			MagnifyingGlass($$renderer, {
				size: 14,
				class: "absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
			});
			$$renderer.push(`<!----> <input type="text" placeholder="search snippets..." class="w-full bg-black/20 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-accent-yellow transition-all"${attr("value", snippetSearch)}/></div> <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 svelte-16dnk2j"><!--[-->`);
			const each_array_2 = ensure_array_like(filteredSnippets());
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let snippet = each_array_2[$$index_2];
				$$renderer.push(`<button class="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left group transition-all"><div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-white/80 group-hover:text-accent-yellow transition-colors">${escape_html(snippet.name)}</span> `);
				Plus($$renderer, {
					size: 14,
					class: "text-white/20 group-hover:text-accent-yellow"
				});
				$$renderer.push(`<!----></div> <p class="text-[10px] text-white/40 leading-relaxed line-clamp-2">${escape_html(snippet.description)}</p></button>`);
			}
			$$renderer.push(`<!--]--></div></div></div></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BMG6LpAI.js.map

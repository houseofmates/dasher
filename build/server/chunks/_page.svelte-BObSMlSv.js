import { a3 as onDestroy, e as ensure_array_like, c as escape_html } from './index-server-Ip8I2Crl.js';
import { T as TerminalWindow, v as CaretRight, B as Broadcast } from './lib--dU9BMBy.js';
import './toast-CcsTuW86.js';
import '@xterm/xterm';
import '@xterm/addon-fit';
import 'clsx';

//#region src/routes/terminal/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let selectedContainerId = "";
		let isConnected = false;
		function connect() {}
		onDestroy(() => {});
		$$renderer.push(`<div class="flex flex-col gap-8"><div class="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><h1 class="text-4xl font-black tracking-tighter lowercase flex items-center gap-3">`);
		TerminalWindow($$renderer, {
			class: "text-accent-yellow",
			size: 40,
			weight: "fill"
		});
		$$renderer.push(`<!----> terminal</h1> <p class="text-white/40 font-medium lowercase mt-1">direct container access</p></div> <div class="flex items-center gap-3"><div class="relative group">`);
		$$renderer.select({
			class: "bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-yellow transition-all appearance-none pr-10 min-w-[200px] preserve-case",
			value: selectedContainerId,
			onchange: connect,
			disabled: isConnected
		}, ($$renderer) => {
			$$renderer.option({
				value: "",
				disabled: true
			}, ($$renderer) => {
				$$renderer.push(`select container`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(data.containers);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let container = each_array[$$index];
				$$renderer.option({ value: container.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(container.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-focus-within:text-accent-yellow transition-colors">`);
		CaretRight($$renderer, {
			size: 16,
			weight: "bold"
		});
		$$renderer.push(`<!----></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="card p-1 min-h-[600px] h-[calc(100dvh-320px)] flex flex-col overflow-hidden group"><div class="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/2"><div class="flex gap-1.5"><div class="w-2.5 h-2.5 rounded-full bg-red-500/40"></div> <div class="w-2.5 h-2.5 rounded-full bg-accent-yellow/40"></div> <div class="w-2.5 h-2.5 rounded-full bg-green-500/40"></div></div> <div class="flex items-center gap-2 text-[10px] font-bold text-white/20 tracking-widest uppercase">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`offline`);
		$$renderer.push(`<!--]--></div></div> <div class="flex-1 p-4 bg-black/40 overflow-hidden relative"><div class="h-full w-full"></div> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10">`);
		Broadcast($$renderer, {
			size: 64,
			weight: "thin"
		});
		$$renderer.push(`<!----> <p class="text-lg font-medium lowercase">select a container to start</p></div>`);
		$$renderer.push(`<!--]--></div></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BObSMlSv.js.map

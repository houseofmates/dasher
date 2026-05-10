import { a4 as onDestroy, R as ensure_array_like, V as escape_html, T as attr_class, X as attr, A as derived } from './index-server-C4D8vfaK.js';
import { T as TerminalWindow, n as CaretDown, E as CaretLeft, s as Stop, u as Plus, J as Broadcast } from './lib-D4dETbbR.js';
import { t as toasts } from './toast-aIxD4KVa.js';
import { C as ContextMenu, a as ContextMenuItem } from './ContextMenuItem-CjOThxT_.js';
import '@xterm/xterm';
import '@xterm/addon-fit';
import 'clsx';

//#region src/routes/terminal/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		let tabs = [];
		let activeTabId = "";
		let selectIsOpen = false;
		const activeTab = derived(() => tabs.find((t) => t.id === activeTabId) ?? null);
		function connect(tab) {
			if (!tab.selectedContainerId) return;
			tab.socket?.close();
			const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
			tab.socket = new WebSocket(`${protocol}//${window.location.host}/terminal?id=${tab.selectedContainerId}`);
			tab.socket.onopen = () => {
				tab.isConnected = true;
				tabs = [...tabs];
				tab.term?.reset();
				tab.term?.focus();
				toasts.success("terminal connected");
			};
			tab.socket.onmessage = (e) => tab.term?.write(e.data);
			tab.socket.onerror = () => toasts.error("websocket error");
			tab.socket.onclose = () => {
				tab.isConnected = false;
				tabs = [...tabs];
				tab.term?.write("\r\n\x1B[31m[session closed]\x1B[0m\r\n");
			};
		}
		let dragSrcId = null;
		let tabMenu = {
			show: false,
			x: 0,
			y: 0};
		let barMenu = {
			show: false,
			x: 0,
			y: 0
		};
		onDestroy(() => {
			tabs.forEach((t) => {
				t.socket?.close();
				t.term?.dispose();
			});
		});
		$$renderer.push(`<div class="flex flex-col gap-8"><div class="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><h1 class="text-4xl font-black tracking-tighter lowercase flex items-center gap-3">`);
		TerminalWindow($$renderer, {
			class: "text-accent-yellow",
			size: 40,
			weight: "fill"
		});
		$$renderer.push(`<!----> terminal</h1> <p class="text-white/40 font-medium lowercase mt-1">direct container access</p></div> `);
		if (activeTab()) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex items-center gap-3"><div class="relative">`);
			$$renderer.select({
				class: "select-container bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-yellow transition-all appearance-none pr-10 min-w-[200px] preserve-case",
				value: activeTab().selectedContainerId,
				onchange: () => connect(activeTab()),
				onfocus: () => selectIsOpen = true,
				onblur: () => selectIsOpen = false,
				disabled: activeTab().isConnected
			}, ($$renderer) => {
				$$renderer.option({
					value: "",
					disabled: true,
					class: ""
				}, ($$renderer) => {
					$$renderer.push(`select container`);
				}, "svelte-1dhdpeh");
				$$renderer.push(`<!--[-->`);
				const each_array = ensure_array_like(data.containers);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let container = each_array[$$index];
					$$renderer.option({
						value: container.id,
						class: ""
					}, ($$renderer) => {
						$$renderer.push(`${escape_html(container.name)}`);
					}, "svelte-1dhdpeh");
				}
				$$renderer.push(`<!--]-->`);
			}, "svelte-1dhdpeh");
			$$renderer.push(` <div${attr_class("absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors", void 0, {
				"text-accent-yellow": selectIsOpen,
				"text-white": !selectIsOpen
			})}>`);
			if (selectIsOpen) {
				$$renderer.push("<!--[0-->");
				CaretDown($$renderer, {
					size: 16,
					weight: "bold"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				CaretLeft($$renderer, {
					size: 16,
					weight: "bold"
				});
			}
			$$renderer.push(`<!--]--></div></div> `);
			if (activeTab().isConnected) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<button class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm font-bold transition-all flex items-center gap-2 lowercase">`);
				Stop($$renderer, {
					size: 18,
					weight: "fill"
				});
				$$renderer.push(`<!----> stop</button>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="card p-1 min-h-[600px] h-[calc(100dvh-320px)] flex flex-col overflow-hidden group"><div class="flex items-stretch gap-0 border-b border-white/5 bg-black/20 overflow-x-auto min-h-[38px] select-none" role="tablist" tabindex="0"><!--[-->`);
		const each_array_1 = ensure_array_like(tabs);
		for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
			let tab = each_array_1[$$index_1];
			$$renderer.push(`<button${attr_class("tab-pill flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border-r border-white/5 cursor-pointer relative group/tab svelte-1dhdpeh", void 0, {
				"active": tab.id === activeTabId,
				"dragging": dragSrcId === tab.id
			})}${attr("draggable", true)} role="tab"${attr("aria-selected", tab.id === activeTabId)}>`);
			if (tab.isConnected) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<span class="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0"></span>`);
			}
			$$renderer.push(`<!--]--> <span class="preserve-case">${escape_html(tab.label)}</span></button>`);
		}
		$$renderer.push(`<!--]--> <button class="flex items-center justify-center px-3 py-2 text-white/20 hover:text-white/60 transition-colors shrink-0" title="new tab">`);
		Plus($$renderer, {
			size: 14,
			weight: "bold"
		});
		$$renderer.push(`<!----></button> <div class="flex-1" role="presentation"></div></div> <div class="flex-1 overflow-hidden relative bg-black/40"><!--[-->`);
		const each_array_2 = ensure_array_like(tabs);
		for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
			let tab = each_array_2[$$index_2];
			$$renderer.push(`<div${attr_class("absolute inset-0 p-4", void 0, { "hidden": tab.id !== activeTabId })}></div> `);
			if (!tab.isConnected && !tab.selectedContainerId && tab.id === activeTabId) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/10 pointer-events-none">`);
				Broadcast($$renderer, {
					size: 64,
					weight: "thin"
				});
				$$renderer.push(`<!----> <p class="text-lg font-medium lowercase">select a container to start</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]--></div></div></div> `);
		ContextMenu($$renderer, {
			show: tabMenu.show,
			x: tabMenu.x,
			y: tabMenu.y,
			onClose: () => tabMenu.show = false,
			children: ($$renderer) => {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			}});
		$$renderer.push(`<!----> `);
		ContextMenu($$renderer, {
			show: barMenu.show,
			x: barMenu.x,
			y: barMenu.y,
			onClose: () => barMenu.show = false,
			children: ($$renderer) => {
				ContextMenuItem($$renderer, {
					label: "new tab",
					icon: Plus});
			}});
		$$renderer.push(`<!---->`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B-yHkmV5.js.map

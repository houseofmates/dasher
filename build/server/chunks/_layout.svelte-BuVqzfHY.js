import { R as ensure_array_like, S as store_get, T as attr_class, U as stringify, V as escape_html, W as unsubscribe_stores, X as attr, Y as clsx$1 } from './index-server-C4D8vfaK.js';
import { p as page } from './state-Garca2Gw.js';
import { C as CheckCircle, X as XCircle, W as Warning, I as Info, a as X, b as Cube, c as Images, H as HardDrive, S as ShareNetwork, F as FileCode, d as ChartBar, T as TerminalWindow, e as ChatCircleDots } from './lib-D4dETbbR.js';
import { t as toasts } from './toast-aIxD4KVa.js';
import { clsx } from 'clsx';
import '@capacitor/status-bar';
import './client-8a8Iwnrs.js';
import './internal-DtnETr1j.js';
import './index-DBqjc0Yf.js';

//#region src/lib/components/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				label: "containers",
				icon: Cube,
				href: "/containers"
			},
			{
				label: "images",
				icon: Images,
				href: "/images"
			},
			{
				label: "volumes",
				icon: HardDrive,
				href: "/volumes"
			},
			{
				label: "networks",
				icon: ShareNetwork,
				href: "/networks"
			},
			{
				label: "compose",
				icon: FileCode,
				href: "/compose"
			},
			{
				label: "analytics",
				icon: ChartBar,
				href: "/analytics"
			},
			{
				label: "terminal",
				icon: TerminalWindow,
				href: "/terminal"
			},
			{
				label: "chat",
				icon: ChatCircleDots,
				href: "/chat"
			}
		];
		$$renderer.push(`<aside class="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/10 hidden lg:flex flex-col p-6 z-40"><div class="mb-12"><a href="/" class="block"><img src="/icon.png" alt="docker" class="h-10 w-auto rounded-xl" style="background:#000;padding:4px;"/></a></div> <nav class="flex-1 space-y-2"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = page.url.pathname === item.href || item.href !== "/" && page.url.pathname.startsWith(item.href);
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(clsx$1(clsx("flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-95", active ? "bg-accent-yellow text-black" : "text-white hover:bg-white/5")))}>`);
			if (item.icon) {
				$$renderer.push("<!--[-->");
				item.icon($$renderer, {
					size: 24,
					weight: active ? "fill" : "regular",
					strokeWidth: 1.5
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <span class="font-medium">${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></nav></aside>`);
	});
}
//#endregion
//#region src/lib/components/BottomBar.svelte
function BottomBar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const navItems = [
			{
				label: "containers",
				icon: Cube,
				href: "/containers"
			},
			{
				label: "images",
				icon: Images,
				href: "/images"
			},
			{
				label: "volumes",
				icon: HardDrive,
				href: "/volumes"
			},
			{
				label: "networks",
				icon: ShareNetwork,
				href: "/networks"
			},
			{
				label: "compose",
				icon: FileCode,
				href: "/compose"
			},
			{
				label: "analytics",
				icon: ChartBar,
				href: "/analytics"
			},
			{
				label: "terminal",
				icon: TerminalWindow,
				href: "/terminal"
			},
			{
				label: "chat",
				icon: ChatCircleDots,
				href: "/chat"
			}
		];
		$$renderer.push(`<nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 lg:hidden flex justify-around items-center h-20 pb-safe z-40 svelte-1e81imw"><!--[-->`);
		const each_array = ensure_array_like(navItems);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let item = each_array[$$index];
			const active = page.url.pathname === item.href || item.href !== "/" && page.url.pathname.startsWith(item.href);
			$$renderer.push(`<a${attr("href", item.href)}${attr_class(clsx$1(clsx("flex flex-col items-center gap-1 transition-all active:scale-95", active ? "text-accent-yellow" : "text-white/60")), "svelte-1e81imw")}>`);
			if (item.icon) {
				$$renderer.push("<!--[-->");
				item.icon($$renderer, {
					size: 28,
					weight: active ? "fill" : "regular",
					strokeWidth: 1.5
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(` <span class="text-[10px] font-bold tracking-tight">${escape_html(item.label)}</span></a>`);
		}
		$$renderer.push(`<!--]--></nav>`);
	});
}
//#endregion
//#region src/lib/components/Toaster.svelte
function Toaster($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		var $$store_subs;
		const colors = {
			success: "text-green-400 border-green-500/20 bg-green-500/10",
			error: "text-red-400 border-red-500/20 bg-red-500/10",
			info: "text-blue-400 border-blue-500/20 bg-blue-500/10",
			warning: "text-accent-yellow border-accent-yellow/20 bg-accent-yellow/10"
		};
		$$renderer.push(`<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full" role="status" aria-live="polite"><!--[-->`);
		const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let toast = each_array[$$index];
			$$renderer.push(`<div${attr_class(`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${stringify(colors[toast.type])}`)}><div class="mt-0.5">`);
			if (toast.type === "success") {
				$$renderer.push("<!--[0-->");
				CheckCircle($$renderer, {
					size: 20,
					weight: "fill"
				});
			} else {
				$$renderer.push("<!--[-1-->");
				if (toast.type === "error") {
					$$renderer.push("<!--[0-->");
					XCircle($$renderer, {
						size: 20,
						weight: "fill"
					});
				} else {
					$$renderer.push("<!--[-1-->");
					if (toast.type === "warning") {
						$$renderer.push("<!--[0-->");
						Warning($$renderer, {
							size: 20,
							weight: "fill"
						});
					} else {
						$$renderer.push("<!--[-1-->");
						Info($$renderer, {
							size: 20,
							weight: "fill"
						});
					}
					$$renderer.push(`<!--]-->`);
				}
				$$renderer.push(`<!--]-->`);
			}
			$$renderer.push(`<!--]--></div> <div class="flex-1 min-w-0"><p class="text-sm font-medium leading-relaxed lowercase">${escape_html(toast.message)}</p></div> <button class="opacity-50 hover:opacity-100 transition-opacity mt-0.5">`);
			X($$renderer, {
				size: 16,
				weight: "bold"
			});
			$$renderer.push(`<!----></button></div>`);
		}
		$$renderer.push(`<!--]--></div>`);
		if ($$store_subs) unsubscribe_stores($$store_subs);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		Toaster($$renderer);
		$$renderer.push(`<!----> <div class="min-h-[100dvh] bg-background text-white selection:bg-accent-yellow selection:text-black">`);
		Sidebar($$renderer);
		$$renderer.push(`<!----> <main class="lg:ml-64 p-4 md:p-8 lg:p-12 pb-32 lg:pb-12 max-w-[1400px] mx-auto">`);
		children($$renderer);
		$$renderer.push(`<!----></main> `);
		BottomBar($$renderer);
		$$renderer.push(`<!----></div>`);
	});
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-BuVqzfHY.js.map

import { a2 as attr_style, U as stringify, A as derived, T as attr_class, Y as clsx$1, X as attr, V as escape_html } from './index-server-C4D8vfaK.js';
import { clsx } from 'clsx';

//#region src/lib/components/ContextMenu.svelte
function ContextMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { x, y, show, onClose, children } = $$props;
		let adjustedX = derived(() => x);
		let adjustedY = derived(() => y);
		if (show) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed z-[100] min-w-[160px] bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"${attr_style(`left: ${stringify(adjustedX())}px; top: ${stringify(adjustedY())}px;`)}>`);
			children($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/ContextMenuItem.svelte
function ContextMenuItem($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { label, icon: Icon, variant = "default", disabled = false } = $$props;
		$$renderer.push(`<button${attr_class(clsx$1(clsx("w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left", variant === "danger" ? "text-red-400 hover:bg-red-500/10" : "text-white/80 hover:bg-white/5", disabled && "opacity-50 cursor-not-allowed pointer-events-none")))}${attr("disabled", disabled, true)}>`);
		if (Icon) {
			$$renderer.push("<!--[0-->");
			if (Icon) {
				$$renderer.push("<!--[-->");
				Icon($$renderer, { size: 18 });
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <span class="capitalize">${escape_html(label)}</span></button>`);
	});
}

export { ContextMenu as C, ContextMenuItem as a };
//# sourceMappingURL=ContextMenuItem-CjOThxT_.js.map

import { a2 as attr_style, b as stringify } from './index-server-Ip8I2Crl.js';
import 'clsx';

//#region src/lib/components/ContextMenu.svelte
function ContextMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { x, y, show, onClose, children } = $$props;
		if (show) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="fixed z-[100] min-w-[160px] bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5"${attr_style(`left: ${stringify(x)}px; top: ${stringify(y)}px;`)}>`);
			children($$renderer);
			$$renderer.push(`<!----></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}

export { ContextMenu as C };
//# sourceMappingURL=ContextMenuItem-BAuBikxI.js.map

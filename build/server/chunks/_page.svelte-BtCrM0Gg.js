import { e as ensure_array_like, f as attr, b as stringify, c as escape_html } from './index-server-Ip8I2Crl.js';
import { H as HardDrive, r as Trash } from './lib--dU9BMBy.js';
import './toast-CcsTuW86.js';
import './client-B-1rA_pX.js';
import 'clsx';
import './internal-GnTtL5YM.js';
import './index-DBqjc0Yf.js';

//#region src/routes/volumes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<div class="space-y-8"><h2 class="text-3xl font-bold tracking-tight">volumes</h2> <div class="bento-grid"><!--[-->`);
		const each_array = ensure_array_like(data.volumes);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let volume = each_array[$$index];
			$$renderer.push(`<a${attr("href", `/volumes/${stringify(encodeURIComponent(volume.Name))}`)} class="card flex flex-col justify-between gap-4 group hover:border-white/20 transition-all"><div class="flex items-center gap-3"><div class="p-2 bg-accent-yellow/10 rounded-lg text-accent-yellow group-hover:bg-accent-yellow/20 transition-colors">`);
			HardDrive($$renderer, { size: 20 });
			$$renderer.push(`<!----></div> <p class="font-bold truncate preserve-case"${attr("title", volume.Name)}>${escape_html(volume.Name)}</p></div> <div class="flex items-center justify-between text-xs text-white/40 font-mono"><span>${escape_html(volume.Driver)}</span> <button class="hover:text-red-500 transition-colors p-1">`);
			Trash($$renderer, { size: 16 });
			$$renderer.push(`<!----></button></div></a>`);
		}
		$$renderer.push(`<!--]--></div></div>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BtCrM0Gg.js.map

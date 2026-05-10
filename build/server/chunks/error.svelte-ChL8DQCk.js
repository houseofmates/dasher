import { V as escape_html } from './index-server-C4D8vfaK.js';
import { p as page } from './state-CAJR52nV.js';
import 'clsx';
import './client-Cu2AptSW.js';
import './internal-WsxKaTee.js';
import './index-DBqjc0Yf.js';

//#region node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}

export { Error as default };
//# sourceMappingURL=error.svelte-ChL8DQCk.js.map

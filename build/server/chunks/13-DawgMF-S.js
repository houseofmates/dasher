import { e as docker } from './docker-BvLAT0W1.js';
import { e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/volumes/[name]/+page.server.ts
var load = async ({ params }) => {
	try {
		return { volume: await docker.getVolume(params.name).inspect() };
	} catch (e) {
		throw error(404, "volume not found");
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CoJmExDx.js')).default;
const server_id = "src/routes/volumes/[name]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.fI6nBSG5.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/BfUE_EQF.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-DawgMF-S.js.map

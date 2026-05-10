import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/volumes/[name]/+page.server.ts
var load = async ({ params }) => {
	try {
		return { volume: await docker$1.getVolume(params.name).inspect() };
	} catch (e) {
		throw error(404, "volume not found");
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D4jHWy02.js')).default;
const server_id = "src/routes/volumes/[name]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.bCL6omdD.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/CkbfweIC.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/chunks/2XceG1rL.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/D7TJS66S.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-CgO898JH.js.map

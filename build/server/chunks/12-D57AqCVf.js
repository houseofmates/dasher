import { b as getVolumes } from './docker-BvLAT0W1.js';
import 'path';
import 'dockerode';

//#region src/routes/volumes/+page.server.ts
var load = async () => {
	return { volumes: await getVolumes() };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BtCrM0Gg.js')).default;
const server_id = "src/routes/volumes/+page.server.ts";
const imports = ["_app/immutable/nodes/12.DrEaiIXW.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/BfUE_EQF.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-D57AqCVf.js.map

import { d as discoverStacks } from './compose-BTNP7U-v.js';
import './shared-server-9-2j12mp.js';
import 'fs/promises';
import 'child_process';
import 'util';
import 'path';

//#region src/routes/compose/+page.server.ts
var load = async () => {
	return { stacks: await discoverStacks() };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B3UmM-3T.js')).default;
const server_id = "src/routes/compose/+page.server.ts";
const imports = ["_app/immutable/nodes/4.DmPJmcTe.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/W1x2HKPV.js","_app/immutable/chunks/BfUE_EQF.js","_app/immutable/chunks/BSTYxbxq.js"];
const stylesheets = ["_app/immutable/assets/4.C0sN08Yp.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-89PYbG_S.js.map

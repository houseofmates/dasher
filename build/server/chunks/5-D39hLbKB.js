import { d as discoverStacks } from './compose-BY5s8Z1T.js';
import 'fs/promises';
import 'path';
import 'child_process';
import 'util';

//#region src/routes/compose/+page.server.ts
var load = async () => {
	return { stacks: await discoverStacks() };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BMG6LpAI.js')).default;
const server_id = "src/routes/compose/+page.server.ts";
const imports = ["_app/immutable/nodes/5.DUxV3uI7.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/BcBdsgUK.js","_app/immutable/chunks/D7TJS66S.js","_app/immutable/chunks/CL0w5ZIy.js"];
const stylesheets = ["_app/immutable/assets/5.C0sN08Yp.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-D39hLbKB.js.map

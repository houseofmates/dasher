import { g as getContainers } from './docker-BvLAT0W1.js';
import 'path';
import 'dockerode';

//#region src/routes/terminal/+page.server.ts
var load = async () => {
	return { containers: (await getContainers()).map((c) => ({
		id: c.Id,
		name: c.Names[0].replace(/^\//, "")
	})) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BObSMlSv.js')).default;
const server_id = "src/routes/terminal/+page.server.ts";
const imports = ["_app/immutable/nodes/11.CfZF3B-T.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/W1x2HKPV.js","_app/immutable/chunks/BfUE_EQF.js","_app/immutable/chunks/BSTYxbxq.js"];
const stylesheets = ["_app/immutable/assets/11.DuxNnNRx.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=11-DNq4l1zB.js.map

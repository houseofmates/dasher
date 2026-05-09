import { g as getContainers } from './docker-BvLAT0W1.js';
import 'path';
import 'dockerode';

//#region src/routes/containers/+page.server.ts
var load = async () => {
	return { containers: (await getContainers(true)).map((c) => ({
		id: c.Id,
		name: c.Names[0].replace(/^\//, ""),
		state: c.State,
		status: c.Status,
		image: c.Image,
		ports: c.Ports,
		created: c.Created
	})) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-M_P7TjYr.js')).default;
const server_id = "src/routes/containers/+page.server.ts";
const imports = ["_app/immutable/nodes/5.BXHUKOy6.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/W1x2HKPV.js","_app/immutable/chunks/B9yYjkrs.js","_app/immutable/chunks/BfUE_EQF.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-CkhrJtCU.js.map

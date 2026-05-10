import { g as getContainers } from './docker-DO4mZ4Jo.js';
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

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Cp7_kRC0.js')).default;
const server_id = "src/routes/containers/+page.server.ts";
const imports = ["_app/immutable/nodes/6.CoSowgdx.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/DwR3r_3y.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/chunks/BDTtr6xS.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/BcBdsgUK.js","_app/immutable/chunks/CFpPuiy_.js","_app/immutable/chunks/D7TJS66S.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-DbIqANfR.js.map

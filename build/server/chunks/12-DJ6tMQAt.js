import { g as getContainers } from './docker-DO4mZ4Jo.js';
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

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-B-yHkmV5.js')).default;
const server_id = "src/routes/terminal/+page.server.ts";
const imports = ["_app/immutable/nodes/12.CiQSBufT.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/BcBdsgUK.js","_app/immutable/chunks/DwRRXxAR.js","_app/immutable/chunks/D7TJS66S.js","_app/immutable/chunks/CL0w5ZIy.js"];
const stylesheets = ["_app/immutable/assets/12.CNkmij0H.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-DJ6tMQAt.js.map

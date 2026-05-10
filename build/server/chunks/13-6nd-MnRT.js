import { b as getVolumes } from './docker-DO4mZ4Jo.js';
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

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-D5jM8zkn.js')).default;
const server_id = "src/routes/volumes/+page.server.ts";
const imports = ["_app/immutable/nodes/13.DVYW720a.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/D-VKth4p.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/chunks/BKZEPakw.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/BcBdsgUK.js","_app/immutable/chunks/CFpPuiy_.js","_app/immutable/chunks/D7TJS66S.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-6nd-MnRT.js.map

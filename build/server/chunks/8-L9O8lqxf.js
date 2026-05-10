import { a as getImages } from './docker-DO4mZ4Jo.js';
import 'path';
import 'dockerode';

//#region src/routes/images/+page.server.ts
var load = async () => {
	return { images: (await getImages()).map((img) => ({
		id: img.Id,
		tags: img.RepoTags || ["<none>"],
		size: img.Size,
		created: img.Created
	})) };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 8;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CFb0rY5h.js')).default;
const server_id = "src/routes/images/+page.server.ts";
const imports = ["_app/immutable/nodes/8.BtPRNToz.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/D-VKth4p.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/chunks/BKZEPakw.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/BcBdsgUK.js","_app/immutable/chunks/CFpPuiy_.js","_app/immutable/chunks/D7TJS66S.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=8-L9O8lqxf.js.map

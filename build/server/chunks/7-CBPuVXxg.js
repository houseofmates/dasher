import { a as getImages } from './docker-BvLAT0W1.js';
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

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C8bqyljr.js')).default;
const server_id = "src/routes/images/+page.server.ts";
const imports = ["_app/immutable/nodes/7.Cmw-Iuq5.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/W1x2HKPV.js","_app/immutable/chunks/B9yYjkrs.js","_app/immutable/chunks/BfUE_EQF.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-CBPuVXxg.js.map

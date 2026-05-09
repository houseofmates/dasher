import { g as getContainers, a as getImages, b as getVolumes, c as getNetworks } from './docker-BvLAT0W1.js';
import 'path';
import 'dockerode';

//#region src/routes/+page.server.ts
var load = async () => {
	const [containers, images, volumes, networks] = await Promise.all([
		getContainers(true),
		getImages(),
		getVolumes(),
		getNetworks()
	]);
	return { stats: {
		containers: {
			total: containers.length,
			running: containers.filter((c) => c.State === "running").length,
			stopped: containers.filter((c) => c.State !== "running").length
		},
		images: images.length,
		volumes: volumes.length,
		networks: networks.length
	} };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-ByLLjPze.js')).default;
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.BL-yLO0X.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=2-5OUyMpwQ.js.map

import { e as docker } from './docker-BvLAT0W1.js';
import { e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/containers/[id]/+page.server.ts
var load = async ({ params }) => {
	const { id } = params;
	try {
		const info = await docker.getContainer(id).inspect();
		return { container: {
			id: info.Id,
			name: info.Name.replace(/^\//, ""),
			state: info.State.Status,
			image: info.Config.Image,
			created: info.Created,
			env: info.Config.Env,
			ports: info.NetworkSettings.Ports
		} };
	} catch (e) {
		throw error(404, "container not found");
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DNf4wVVt.js')).default;
const server_id = "src/routes/containers/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/6.tEiRknpE.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/B2EJUZxf.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/CrVEESoO.js","_app/immutable/chunks/BfUE_EQF.js"];
const stylesheets = ["_app/immutable/assets/uPlot.CnsZ1jie.css","_app/immutable/assets/6.1yPEXFx6.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-AhJs3XVs.js.map

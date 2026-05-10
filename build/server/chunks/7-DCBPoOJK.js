import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/containers/[id]/+page.server.ts
var load = async ({ params }) => {
	const { id } = params;
	try {
		const info = await docker$1.getContainer(id).inspect();
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

const index = 7;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bpy3q6g6.js')).default;
const server_id = "src/routes/containers/[id]/+page.server.ts";
const imports = ["_app/immutable/nodes/7.B1YHRFKJ.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/D-VKth4p.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/chunks/BKZEPakw.js","_app/immutable/chunks/DY0kq_RG.js","_app/immutable/chunks/DEggy0fl.js","_app/immutable/chunks/C7HceTwk.js","_app/immutable/chunks/D7TJS66S.js"];
const stylesheets = ["_app/immutable/assets/uPlot.CnsZ1jie.css","_app/immutable/assets/7.1yPEXFx6.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=7-DCBPoOJK.js.map

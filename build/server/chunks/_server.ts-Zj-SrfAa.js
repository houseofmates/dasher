import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { j as json, e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/volumes/[name]/+server.ts
var DELETE = async ({ params }) => {
	try {
		await docker$1.getVolume(params.name).remove();
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { DELETE };
//# sourceMappingURL=_server.ts-Zj-SrfAa.js.map

import { e as docker } from './docker-BvLAT0W1.js';
import { j as json, e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/volumes/[name]/+server.ts
var DELETE = async ({ params }) => {
	try {
		await docker.getVolume(params.name).remove();
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { DELETE };
//# sourceMappingURL=_server.ts-BpD7q1sR.js.map

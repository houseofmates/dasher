import { e as docker } from './docker-BvLAT0W1.js';
import { j as json, e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/networks/[id]/+server.ts
var DELETE = async ({ params }) => {
	try {
		await docker.getNetwork(params.id).remove();
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { DELETE };
//# sourceMappingURL=_server.ts-jc_KcY9w.js.map

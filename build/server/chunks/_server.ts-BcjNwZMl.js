import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { j as json, e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/images/[id]/+server.ts
var DELETE = async ({ params }) => {
	try {
		await docker$1.getImage(params.id).remove();
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};
var GET = async ({ params }) => {
	try {
		return json(await docker$1.getImage(params.id).inspect());
	} catch (e) {
		throw error(500, e.message);
	}
};

export { DELETE, GET };
//# sourceMappingURL=_server.ts-BcjNwZMl.js.map

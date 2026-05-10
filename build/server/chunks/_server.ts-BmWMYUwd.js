import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { e as error, j as json } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/containers/[id]/rename/+server.ts
var POST = async ({ params, request }) => {
	const { id } = params;
	const { name } = await request.json();
	if (!name) throw error(400, "name required");
	try {
		await docker$1.getContainer(id).rename({ name });
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BmWMYUwd.js.map

import { r as runComposeCommand } from './compose-BTNP7U-v.js';
import { j as json, e as error } from './index-CG007fFn.js';
import './shared-server-9-2j12mp.js';
import 'fs/promises';
import 'child_process';
import 'util';
import 'path';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/compose/run/+server.ts
var POST = async ({ request }) => {
	const { path, command } = await request.json();
	try {
		return json(await runComposeCommand(path, command));
	} catch (e) {
		throw error(500, e.message);
	}
};

export { POST };
//# sourceMappingURL=_server.ts-C41jlu7c.js.map

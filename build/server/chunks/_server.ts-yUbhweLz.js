import { r as runComposeCommand } from './compose-BY5s8Z1T.js';
import { j as json, e as error } from './index-CG007fFn.js';
import 'fs/promises';
import 'path';
import 'child_process';
import 'util';
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
//# sourceMappingURL=_server.ts-yUbhweLz.js.map

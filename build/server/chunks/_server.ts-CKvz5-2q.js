import { r as runComposeCommand } from './compose-BTNP7U-v.js';
import { e as error, j as json } from './index-CG007fFn.js';
import fs from 'fs/promises';
import './shared-server-9-2j12mp.js';
import 'child_process';
import 'util';
import 'path';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/compose/handler/+server.ts
var GET = async ({ url }) => {
	const path = url.searchParams.get("path");
	if (!path) throw error(400, "path required");
	try {
		return json({ content: await fs.readFile(path, "utf-8") });
	} catch (e) {
		throw error(500, e.message);
	}
};
var POST = async ({ request, url }) => {
	const action = url.pathname.split("/").pop();
	const body = await request.json();
	if (action === "save") try {
		await fs.writeFile(body.path, body.content);
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
	if (action === "run") try {
		return json(await runComposeCommand(body.path, body.command));
	} catch (e) {
		throw error(500, e.message);
	}
	throw error(400, "invalid action");
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CKvz5-2q.js.map

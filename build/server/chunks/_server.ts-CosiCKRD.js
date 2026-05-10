import { e as error, j as json } from './index-CG007fFn.js';
import fs from 'fs/promises';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/compose/content/+server.ts
var GET = async ({ url }) => {
	const path = url.searchParams.get("path");
	if (!path) throw error(400, "path required");
	try {
		return json({ content: await fs.readFile(path, "utf-8") });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { GET };
//# sourceMappingURL=_server.ts-CosiCKRD.js.map

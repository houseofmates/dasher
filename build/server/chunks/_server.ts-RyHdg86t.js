import { j as json, e as error } from './index-CG007fFn.js';
import fs from 'fs/promises';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/compose/save/+server.ts
var POST = async ({ request }) => {
	const { path, content } = await request.json();
	try {
		await fs.writeFile(path, content);
		return json({ success: true });
	} catch (e) {
		throw error(500, e.message);
	}
};

export { POST };
//# sourceMappingURL=_server.ts-RyHdg86t.js.map

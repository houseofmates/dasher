import { e as docker } from './docker-BvLAT0W1.js';
import { e as error, j as json } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/images/[id]/tag/+server.ts
var POST = async ({ params, request }) => {
	const { tag } = await request.json();
	if (!tag) throw error(400, "tag is required");
	try {
		const image = docker.getImage(params.id);
		const parts = tag.split(":");
		const repo = parts[0];
		const t = parts[1] || "latest";
		await image.tag({
			repo,
			tag: t
		});
		return json({ success: true });
	} catch (e) {
		throw error(500, e instanceof Error ? e.message : "unknown error");
	}
};

export { POST };
//# sourceMappingURL=_server.ts-CSF6dJsW.js.map

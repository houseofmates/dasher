import { e as docker } from './docker-BvLAT0W1.js';
import { e as error, j as json } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/containers/[id]/[action]/+server.ts
var POST = async ({ params }) => {
	const { id, action } = params;
	const container = docker.getContainer(id);
	try {
		switch (action) {
			case "start":
				await container.start();
				break;
			case "stop":
				await container.stop();
				break;
			case "restart":
				await container.restart();
				break;
			case "pause":
				await container.pause();
				break;
			case "unpause":
				await container.unpause();
				break;
			case "kill":
				await container.kill();
				break;
			case "remove":
				await container.remove();
				break;
			default: throw error(400, "invalid action");
		}
		return json({ success: true });
	} catch (e) {
		console.error(`docker action failed: ${e.message}`);
		throw error(500, e.message);
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BX87ygJn.js.map

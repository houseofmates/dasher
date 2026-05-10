import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import { e as error } from './index-CG007fFn.js';
import 'path';
import 'dockerode';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/images/pull/+server.ts
var POST = async ({ request }) => {
	const { image } = await request.json();
	if (!image) throw error(400, "image name required");
	const stream = new ReadableStream({ async start(controller) {
		docker$1.pull(image, (err, pullStream) => {
			if (err) {
				controller.enqueue(`data: ${JSON.stringify({
					type: "error",
					message: err.message
				})}\n\n`);
				controller.close();
				return;
			}
			docker$1.modem.followProgress(pullStream, (err, res) => {
				if (err) controller.enqueue(`data: ${JSON.stringify({
					type: "error",
					message: err.message
				})}\n\n`);
				else controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);
				controller.close();
			}, (event) => {
				controller.enqueue(`data: ${JSON.stringify({
					type: "progress",
					event
				})}\n\n`);
			});
		});
	} });
	return new Response(stream, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	} });
};

export { POST };
//# sourceMappingURL=_server.ts-7J-ZOPFV.js.map

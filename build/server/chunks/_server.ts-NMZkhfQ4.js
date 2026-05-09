import { e as docker } from './docker-BvLAT0W1.js';
import './utils-BAX50FA_.js';
import 'path';
import 'dockerode';

//#region src/routes/api/containers/[id]/logs/+server.ts
var GET = async ({ params }) => {
	const { id } = params;
	const stream = await docker.getContainer(id).logs({
		follow: true,
		stdout: true,
		stderr: true,
		tail: 100,
		timestamps: true
	});
	const readableStream = new ReadableStream({
		start(controller) {
			stream.on("data", (chunk) => {
				const content = chunk.slice(8).toString();
				controller.enqueue(`data: ${JSON.stringify({ log: content })}\n\n`);
			});
			stream.on("end", () => {
				controller.close();
			});
			stream.on("error", (err) => {
				controller.error(err);
			});
		},
		cancel() {
			if (stream.destroy) stream.destroy();
		}
	});
	return new Response(readableStream, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	} });
};

export { GET };
//# sourceMappingURL=_server.ts-NMZkhfQ4.js.map

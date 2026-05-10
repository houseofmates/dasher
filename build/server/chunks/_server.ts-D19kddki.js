import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import './utils-BAX50FA_.js';
import 'path';
import 'dockerode';

//#region src/routes/api/containers/[id]/logs/+server.ts
var GET = async ({ params }) => {
	const { id } = params;
	const stream = await docker$1.getContainer(id).logs({
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
//# sourceMappingURL=_server.ts-D19kddki.js.map

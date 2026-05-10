import { s as streamComposeCommand } from './compose-BY5s8Z1T.js';
import 'fs/promises';
import 'path';
import 'child_process';
import 'util';

//#region src/routes/api/compose/stream/+server.ts
var GET = ({ url }) => {
	const path = url.searchParams.get("path");
	const command = url.searchParams.get("command");
	if (!path || !command) return new Response("missing path or command", { status: 400 });
	const stream = new ReadableStream({
		start(controller) {
			const process = streamComposeCommand(path, command);
			process.stdout.on("data", (data) => {
				controller.enqueue(`data: ${JSON.stringify({
					type: "stdout",
					text: data.toString()
				})}\n\n`);
			});
			process.stderr.on("data", (data) => {
				controller.enqueue(`data: ${JSON.stringify({
					type: "stderr",
					text: data.toString()
				})}\n\n`);
			});
			process.on("close", (code) => {
				controller.enqueue(`data: ${JSON.stringify({
					type: "exit",
					code
				})}\n\n`);
				controller.close();
			});
			process.on("error", (err) => {
				controller.enqueue(`data: ${JSON.stringify({
					type: "error",
					text: err.message
				})}\n\n`);
				controller.close();
			});
		},
		cancel() {}
	});
	return new Response(stream, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	} });
};

export { GET };
//# sourceMappingURL=_server.ts-CSgSLydy.js.map

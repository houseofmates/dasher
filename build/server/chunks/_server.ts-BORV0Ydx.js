import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import 'path';
import 'dockerode';

//#region src/routes/api/events/+server.ts
var GET = () => {
	const stream = new ReadableStream({
		async start(controller) {
			const dockerStream = await docker$1.getEvents();
			let buffer = "";
			dockerStream.on("data", (chunk) => {
				buffer += chunk.toString();
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				for (const line of lines) {
					if (!line.trim()) continue;
					try {
						const event = JSON.parse(line);
						const data = JSON.stringify({
							type: event.Type,
							action: event.Action,
							actor: event.Actor?.Attributes?.name || event.Actor?.ID || "unknown",
							time: event.time
						});
						controller.enqueue(`data: ${data}\n\n`);
					} catch (e) {
						console.error("failed to parse docker event:", line);
					}
				}
			});
			dockerStream.on("error", (err) => {
				controller.error(err);
			});
			dockerStream.on("end", () => {
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
//# sourceMappingURL=_server.ts-BORV0Ydx.js.map

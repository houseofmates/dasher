import { e as docker$1 } from './docker-DO4mZ4Jo.js';
import './utils-BAX50FA_.js';
import 'path';
import 'dockerode';

//#region src/routes/api/containers/[id]/stats/+server.ts
var GET = async ({ params }) => {
	const { id } = params;
	const stream = await docker$1.getContainer(id).stats({ stream: true });
	const readableStream = new ReadableStream({
		start(controller) {
			stream.on("data", (chunk) => {
				const stats = JSON.parse(chunk.toString());
				const cpuPercent = (stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage) / (stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage) * stats.cpu_stats.online_cpus * 100;
				const ramUsage = stats.memory_stats.usage;
				const ramPercent = ramUsage / stats.memory_stats.limit * 100;
				controller.enqueue(`data: ${JSON.stringify({
					cpu: cpuPercent.toFixed(2),
					ram: ramPercent.toFixed(2),
					ramRaw: ramUsage,
					netIn: stats.networks?.eth0?.rx_bytes || 0,
					netOut: stats.networks?.eth0?.tx_bytes || 0
				})}\n\n`);
			});
			stream.on("end", () => controller.close());
			stream.on("error", (err) => controller.error(err));
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
//# sourceMappingURL=_server.ts-DHJzP0TB.js.map

import { error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const container = docker.getContainer(id);

  const stream = await container.stats({ stream: true });

  const readableStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        const stats = JSON.parse(chunk.toString());
        
        // basic calculation for CPU and RAM
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
        
        const ramUsage = stats.memory_stats.usage;
        const ramLimit = stats.memory_stats.limit;
        const ramPercent = (ramUsage / ramLimit) * 100;

        controller.enqueue(`data: ${JSON.stringify({ 
          cpu: cpuPercent.toFixed(2), 
          ram: ramPercent.toFixed(2),
          ramRaw: ramUsage,
          netIn: stats.networks?.eth0?.rx_bytes || 0,
          netOut: stats.networks?.eth0?.tx_bytes || 0
        })}\n\n`);
      });

      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      // @ts-ignore
      if (stream.destroy) stream.destroy();
    }
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
};

import { error } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  const container = docker.getContainer(id);

  const stream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 100,
    timestamps: true
  });

  const readableStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        // docker logs have an 8-byte header (stdout/stderr type, size)
        // we skip it for raw text
        const content = chunk.slice(8).toString();
        controller.enqueue(`data: ${JSON.stringify({ log: content })}\n\n`);
      });

      stream.on('end', () => {
        controller.close();
      });

      stream.on('error', (err) => {
        controller.error(err);
      });
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

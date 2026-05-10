import { error } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { image } = await request.json();
  if (!image) throw error(400, 'image name required');

  const stream = new ReadableStream({
    async start(controller) {
      docker.pull(image, (err: any, pullStream: any) => {
        if (err) {
          controller.enqueue(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
          controller.close();
          return;
        }

        docker.modem.followProgress(
          pullStream,
          (err: any, res: any) => {
            if (err) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
            } else {
              controller.enqueue(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
            }
            controller.close();
          },
          (event: any) => {
            controller.enqueue(`data: ${JSON.stringify({ type: 'progress', event })}\n\n`);
          }
        );
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
};

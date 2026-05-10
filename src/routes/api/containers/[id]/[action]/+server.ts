import { error, json } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params }) => {
  const { id, action } = params;
  const container = docker.getContainer(id);

  try {
    switch (action) {
      case 'start':
        await container.start();
        break;
      case 'stop':
        await container.stop();
        break;
      case 'restart':
        await container.restart();
        break;
      case 'pause':
        await container.pause();
        break;
      case 'unpause':
        await container.unpause();
        break;
      case 'kill':
        await container.kill();
        break;
      case 'remove':
        await container.remove();
        break;
      default:
        throw error(400, 'invalid action');
    }
    return json({ success: true });
  } catch (e: any) {
    console.error(`docker action failed: ${e.message}`);
    throw error(500, e.message);
  }
};

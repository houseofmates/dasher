import { error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  try {
    const container = docker.getContainer(id);
    const info = await container.inspect();
    return {
      container: {
        id: info.Id,
        name: info.Name.replace(/^\//, ''),
        state: info.State.Status,
        image: info.Config.Image,
        created: info.Created,
        env: info.Config.Env,
        ports: info.NetworkSettings.Ports
      }
    };
  } catch (e) {
    throw error(404, 'container not found');
  }
};

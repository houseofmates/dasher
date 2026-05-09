import { error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const network = await docker.getNetwork(params.id).inspect();
    return { network };
  } catch (e: any) {
    throw error(404, 'network not found');
  }
};

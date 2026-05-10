import { error } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const volume = await docker.getVolume(params.name).inspect();
    return { volume };
  } catch (e: any) {
    throw error(404, 'volume not found');
  }
};

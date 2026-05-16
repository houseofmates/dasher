import type { PageServerLoad } from './$types';
import { docker } from '$lib/server/docker';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }: { params: any }) => {
  try {
    const image = docker.getImage(params.id!);
    const info = await image.inspect();
    return { 
      image: info,
      id: params.id 
    };
  } catch (e: any) {
    throw error(404, 'image not found');
  }
};

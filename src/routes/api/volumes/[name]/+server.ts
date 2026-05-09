import { json, error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const volume = docker.getVolume(params.name!);
    await volume.remove();
    return json({ success: true });
  } catch (e: any) {
    throw error(500, e.message);
  }
};

import { json, error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
  const { id } = params;
  const { name } = await request.json();
  
  if (!name) throw error(400, 'name required');

  try {
    const container = docker.getContainer(id!);
    await container.rename({ name });
    return json({ success: true });
  } catch (e: any) {
    throw error(500, e.message);
  }
};

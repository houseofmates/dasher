import { json, error } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const image = docker.getImage(params.id!);
    await image.remove();
    return json({ success: true });
  } catch (e: any) {
    throw error(500, e.message);
  }
};

export const GET: RequestHandler = async ({ params }) => {
  try {
    const image = docker.getImage(params.id!);
    const info = await image.inspect();
    return json(info);
  } catch (e: any) {
    throw error(500, e.message);
  }
};

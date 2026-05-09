import { json, error } from '@sveltejs/kit';
import docker from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
  const { tag } = await request.json() as { tag: string };
  if (!tag) throw error(400, 'tag is required');

  try {
    const image = docker.getImage(params.id);
    // parse tag into repo and tag
    const parts = tag.split(':');
    const repo = parts[0];
    const t = parts[1] || 'latest';
    
    await image.tag({ repo, tag: t });
    return json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unknown error';
    throw error(500, message);
  }
};

import { json, error } from '@sveltejs/kit';
import { runComposeCommand } from '$lib/server/compose';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { path, command } = await request.json();
  try {
    const result = await runComposeCommand(path, command);
    return json(result);
  } catch (e: any) {
    throw error(500, e.message);
  }
};

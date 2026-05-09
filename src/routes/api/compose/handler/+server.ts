import { json, error } from '@sveltejs/kit';
import fs from 'fs/promises';
import { runComposeCommand } from '$lib/server/compose';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const path = url.searchParams.get('path');
  if (!path) throw error(400, 'path required');
  try {
    const content = await fs.readFile(path, 'utf-8');
    return json({ content });
  } catch (e: any) {
    throw error(500, e.message);
  }
};

export const POST: RequestHandler = async ({ request, url }) => {
  const action = url.pathname.split('/').pop();
  const body = await request.json();

  if (action === 'save') {
    try {
      await fs.writeFile(body.path, body.content);
      return json({ success: true });
    } catch (e: any) {
      throw error(500, e.message);
    }
  }

  if (action === 'run') {
    try {
      const result = await runComposeCommand(body.path, body.command);
      return json(result);
    } catch (e: any) {
      throw error(500, e.message);
    }
  }

  throw error(400, 'invalid action');
};

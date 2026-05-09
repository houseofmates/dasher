import { json, error } from '@sveltejs/kit';
import fs from 'fs/promises';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { path, content } = await request.json();
  try {
    await fs.writeFile(path, content);
    return json({ success: true });
  } catch (e: any) {
    throw error(500, e.message);
  }
};

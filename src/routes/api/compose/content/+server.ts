import { json, error } from '@sveltejs/kit';
import fs from 'fs/promises';
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

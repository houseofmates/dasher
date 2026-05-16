import { json } from '@sveltejs/kit';
import { getVolumes, createVolume } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const volumes = await getVolumes();
    return json({ success: true, data: volumes });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, driver, labels } = await request.json();
    
    if (!name) {
      return json({ success: false, error: 'Volume name is required' }, { status: 400 });
    }
    
    const volume = await createVolume(name, driver, labels);
    return json({ success: true, data: volume });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
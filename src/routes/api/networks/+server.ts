import { json } from '@sveltejs/kit';
import { getNetworks, createNetwork } from '$lib/server/docker';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    const networks = await getNetworks();
    return json({ success: true, data: networks });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, driver, options } = await request.json();
    
    if (!name) {
      return json({ success: false, error: 'Network name is required' }, { status: 400 });
    }
    
    const network = await createNetwork(name, driver, options);
    return json({ success: true, data: network });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
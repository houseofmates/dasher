import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getNextApiKey } from '$lib/server/ai';

export const GET: RequestHandler = async () => {
  const nvidiaKeys = Object.entries(env)
    .filter(([key]) => key.startsWith('NVIDIA_API_KEY_'))
    .sort(([a], [b]) => {
      const numA = parseInt(a.replace('NVIDIA_API_KEY_', ''), 10);
      const numB = parseInt(b.replace('NVIDIA_API_KEY_', ''), 10);
      return numA - numB;
    });
  
  const firstKey = getNextApiKey();
  
  return json({
    totalKeys: nvidiaKeys.length,
    keysExist: nvidiaKeys.map(([key]) => key),
    firstKeyAvailable: !!firstKey,
    firstKeyPreview: firstKey ? firstKey.substring(0, 10) + '...' : null
  });
};
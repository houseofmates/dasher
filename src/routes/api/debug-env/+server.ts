import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { getNextApiKey } from '$lib/server/ai';

export const GET: RequestHandler = async () => {
  // Debug environment loading
  const debug = {
    processEnvKeys: Object.keys(process.env).filter(k => k.startsWith('NVIDIA_API_KEY')).length,
    svelteEnvKeys: Object.keys(env).filter(k => k.startsWith('NVIDIA_API_KEY')).length,
    processEnvSample: process.env.NVIDIA_API_KEY_1 ? 'present' : 'missing',
    svelteEnvSample: env.NVIDIA_API_KEY_1 ? 'present' : 'missing',
    getNextApiKeyResult: getNextApiKey(),
    envObjectKeys: Object.keys(env).slice(0, 10), // First 10 keys for debugging
    allProcessKeys: Object.keys(process.env).filter(k => k.includes('NVIDIA'))
  };
  
  return json(debug);
};
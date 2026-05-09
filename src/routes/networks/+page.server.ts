import { getNetworks } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const networks = await getNetworks();
  return { networks };
};

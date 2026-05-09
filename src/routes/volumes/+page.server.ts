import { getVolumes } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const volumes = await getVolumes();
  return { volumes };
};

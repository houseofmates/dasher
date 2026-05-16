import { getContainers } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const containers = await getContainers();
  return {
    containers: containers.map((c: any) => ({
      id: c.Id,
      name: c.Names[0].replace(/^\//, '')
    }))
  };
};

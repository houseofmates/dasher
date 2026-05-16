import { getContainers } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const containers = await getContainers(true);
  return {
    containers: containers.map((c: any) => ({
      id: c.Id,
      name: c.Names[0].replace(/^\//, ''),
      state: c.State,
      status: c.Status,
      image: c.Image,
      ports: c.Ports,
      created: c.Created
    }))
  };
};

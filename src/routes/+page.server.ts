import { getContainers, getImages, getVolumes, getNetworks } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [containers, images, volumes, networks] = await Promise.all([
    getContainers(true),
    getImages(),
    getVolumes(),
    getNetworks()
  ]);

  return {
    stats: {
      containers: {
        total: containers.length,
        running: containers.filter(c => c.State === 'running').length,
        stopped: containers.filter(c => c.State !== 'running').length,
      },
      images: images.length,
      volumes: volumes.length,
      networks: networks.length
    }
  };
};

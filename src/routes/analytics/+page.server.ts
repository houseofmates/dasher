import { getTunnelAnalytics } from '$lib/server/analytics';
import { getContainers, getContainerStats } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const range = url.searchParams.get('range') || '24h';
  
  const [analytics, containers] = await Promise.all([
    getTunnelAnalytics(range),
    getContainers(false) // only running containers
  ]);

  // get stats for top 5 containers
  const containerStats = await Promise.all(
    containers.slice(0, 5).map(async (c) => {
      try {
        const stats = await getContainerStats(c.Id);
        return {
          id: c.Id,
          name: c.Names[0].replace(/^\//, ''),
          stats
        };
      } catch (e) {
        return null;
      }
    })
  );

  return { 
    analytics, 
    range,
    containerStats: containerStats.filter(Boolean)
  };
};

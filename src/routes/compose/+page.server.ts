import { discoverStacks } from '$lib/server/compose';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const stacks = await discoverStacks();
  return { stacks };
};

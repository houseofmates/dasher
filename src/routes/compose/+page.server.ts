import { getComposeServices } from '$lib/server/yaml';
import fs from 'fs/promises';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const mainPath = process.env.MAIN_STACK_PATH;
  if (!mainPath) {
    return { stacks: [], content: null };
  }
  try {
    const services = await getComposeServices(mainPath);
    const stacks = services.map(name => ({ name, path: mainPath }));

    // Load content for the main stack
    let content = null;
    try {
      content = await fs.readFile(mainPath, 'utf-8');
    } catch (error) {
      console.error('Error reading compose file:', error);
    }

    return { stacks, content };
  } catch (error) {
    console.error('Error loading compose stacks:', error);
    return { stacks: [], content: null };
  }
};

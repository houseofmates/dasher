import { getImages } from '$lib/server/docker';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const images = await getImages();
  return {
    images: images.map(img => ({
      id: img.Id,
      tags: img.RepoTags || ['<none>'],
      size: img.Size,
      created: img.Created
    }))
  };
};

import { json } from '@sveltejs/kit';
import { scanImage } from '$lib/server/scan';
import { getLatestVulnerabilityScan } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, url }) => {
  const { id } = params;
  const force = url.searchParams.get('force') === 'true';
  
  try {
    // Get container info to find the image
    const container = await (await import('$lib/server/docker')).getContainer(id);
    const containerInfo = await container.inspect();
    const imageName = containerInfo.Config.Image;
    const imageId = containerInfo.Image;
    
    if (!imageName) {
      return json({ success: false, error: 'Container image not found' }, { status: 404 });
    }
    
    // Check for cached scan first
    const cachedScan = getLatestVulnerabilityScan(imageId);
    
    const scanResult = await scanImage(imageName, imageId, force);
    return json({ 
      success: true, 
      data: scanResult,
      cached: scanResult.cached || false,
      previousScan: cachedScan ? {
        scannedAt: new Date(cachedScan.scanned_at * 1000).toISOString(),
        summary: cachedScan.summary
      } : null
    });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;
  
  try {
    // Get container info to find the image
    const container = await (await import('$lib/server/docker')).getContainer(id);
    const containerInfo = await container.inspect();
    const imageId = containerInfo.Image;
    
    const latestScan = getLatestVulnerabilityScan(imageId);
    
    if (!latestScan) {
      return json({ 
        success: true, 
        data: null,
        message: 'No vulnerability scan found for this container'
      });
    }
    
    return json({ 
      success: true, 
      data: {
        ...latestScan,
        scannedAt: new Date(latestScan.scanned_at * 1000).toISOString()
      }
    });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
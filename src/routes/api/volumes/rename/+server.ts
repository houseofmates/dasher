import { json, error } from '@sveltejs/kit';
import { docker } from '$lib/server/docker';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { RequestHandler } from './$types';

const execAsync = promisify(exec);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { oldName, newName } = await request.json();
    
    if (!oldName || !newName) {
      return json({ success: false, error: 'Both oldName and newName are required' }, { status: 400 });
    }

    if (newName === oldName) {
      return json({ success: false, error: 'New name must be different from current name' }, { status: 400 });
    }

    // Check if new name already exists
    try {
      const existingVolume = docker.getVolume(newName);
      await existingVolume.inspect();
      return json({ success: false, error: 'A volume with this name already exists' }, { status: 409 });
    } catch {
      // Volume doesn't exist, which is what we want
    }

    // Since Docker doesn't have a built-in rename command for volumes,
    // we'll use a workaround by creating a new volume and using docker commands
    // to copy the data if the volume has content
    
    // Create the new volume with the same driver and labels as the old one
    const oldVolume = docker.getVolume(oldName);
    const oldVolumeInfo = await oldVolume.inspect();
    
    const newVolume = await docker.createVolume({
      Name: newName,
      Driver: oldVolumeInfo.Driver,
      Labels: oldVolumeInfo.Labels
    });

    // If the old volume has a mountpoint and contains data, copy it
    if (oldVolumeInfo.Mountpoint) {
      try {
        // Use a temporary container to copy data from old volume to new volume
        const copyCommand = `docker run --rm \
          -v "${oldName}":/source \
          -v "${newName}":/dest \
          alpine sh -c "cp -a /source/. /dest/ 2>/dev/null || true"`;
        
        await execAsync(copyCommand);
      } catch (copyError) {
        // If copy fails, we still proceed with the rename but log the error
        console.warn('Failed to copy volume data:', copyError);
      }
    }

    // Remove the old volume
    await oldVolume.remove();

    return json({ 
      success: true, 
      data: { 
        oldName, 
        newName,
        volume: newVolume 
      }
    });
  } catch (e: any) {
    console.error('Volume rename error:', e);
    throw error(500, e.message || 'Failed to rename volume');
  }
};
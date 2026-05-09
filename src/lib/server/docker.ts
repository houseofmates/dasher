import Docker from 'dockerode';
import path from 'path';

// Use environment variable for main stack path, default to current directory if not set
const searchDir = path.dirname(env.MAIN_STACK_PATH || '.');

export async function getImages() {
  return await docker.listImages();
}

export async function getVolumes() {
  const result = await docker.listVolumes();
  return result.Volumes || [];
}

export async function getNetworks() {
  return await docker.listNetworks();
}

export async function getContainerStats(id: string) {
  const container = docker.getContainer(id);
  // stream: false means we get a single snapshot
  return await container.stats({ stream: false });
}

export async function getContainerLogs(id: string, tail = 100) {
  const container = docker.getContainer(id);
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail,
    timestamps: true
  });
  return logs.toString();
}

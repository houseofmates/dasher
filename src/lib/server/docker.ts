import Docker from 'dockerode';
import path from 'path';
export const docker = new Docker({ socketPath: process.env.DOCKER_SOCK_PATH || '/var/run/docker.sock' });

export async function getContainers(all = true) {
  return await docker.listContainers({ all });
}

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

export function getNetwork(id: string) {
  return docker.getNetwork(id);
}

export function getVolume(name: string) {
  return docker.getVolume(name);
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

export async function getContainer(id: string) {
  return docker.getContainer(id);
}

export async function getImage(id: string) {
  return docker.getImage(id);
}

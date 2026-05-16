import Docker from 'dockerode';
import { checkDockerHealth } from './health';
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
export function getNetwork(id) {
    return docker.getNetwork(id);
}
export function getVolume(name) {
    return docker.getVolume(name);
}
export async function getContainerStats(id) {
    const container = docker.getContainer(id);
    return await container.stats({ stream: false });
}
export async function getContainerLogs(id, tail = 100) {
    const container = docker.getContainer(id);
    const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail,
        timestamps: true
    });
    return logs.toString();
}
export async function getContainer(id) {
    return docker.getContainer(id);
}
export async function getImage(id) {
    return docker.getImage(id);
}
export async function createNetwork(name, driver = 'bridge', options) {
    const config = { Name: name, Driver: driver };
    if (options?.subnet)
        config.IPAM = { Config: [{ Subnet: options.subnet }] };
    if (options?.labels)
        config.Labels = options.labels;
    if (options?.internal)
        config.Internal = true;
    return await docker.createNetwork(config);
}
export async function createVolume(name, driver = 'local', labels) {
    return await docker.createVolume({ Name: name, Driver: driver, Labels: labels });
}
export async function pruneVolumes() {
    return await docker.pruneVolumes();
}
export async function pruneNetworks() {
    return await docker.pruneNetworks();
}
export async function pruneImages(filters) {
    return await docker.pruneImages(filters);
}
export async function pruneContainers(filters) {
    return await docker.pruneContainers(filters);
}
export async function getDockerInfo() {
    return await docker.info();
}
export async function getDockerVersion() {
    return await docker.version();
}
// Health-checked wrapper for critical operations
export async function withHealthCheck(operation) {
    const health = await checkDockerHealth();
    if (!health.healthy) {
        throw new Error(`Docker unavailable: ${health.error}`);
    }
    return await operation();
}

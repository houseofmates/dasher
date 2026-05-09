import 'path';
import Docker from 'dockerode';

//#region src/lib/server/docker.ts
var docker = new Docker({ socketPath: process.env.DOCKER_SOCK_PATH || "/var/run/docker.sock" });
async function getContainers(all = true) {
	return await docker.listContainers({ all });
}
async function getImages() {
	return await docker.listImages();
}
async function getVolumes() {
	return (await docker.listVolumes()).Volumes || [];
}
async function getNetworks() {
	return await docker.listNetworks();
}
async function getContainerStats(id) {
	return await docker.getContainer(id).stats({ stream: false });
}

export { getImages as a, getVolumes as b, getNetworks as c, getContainerStats as d, docker as e, getContainers as g };
//# sourceMappingURL=docker-BvLAT0W1.js.map

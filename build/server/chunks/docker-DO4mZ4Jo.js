import 'path';
import docker from 'dockerode';

//#region src/lib/server/docker.ts
var docker$1 = new docker({ socketPath: process.env.DOCKER_SOCK_PATH || "/var/run/docker.sock" });
async function getContainers(all = true) {
	return await docker$1.listContainers({ all });
}
async function getImages() {
	return await docker$1.listImages();
}
async function getVolumes() {
	return (await docker$1.listVolumes()).Volumes || [];
}
async function getNetworks() {
	return await docker$1.listNetworks();
}
async function getContainerStats(id) {
	return await docker$1.getContainer(id).stats({ stream: false });
}

export { getImages as a, getVolumes as b, getNetworks as c, getContainerStats as d, docker$1 as e, getContainers as g };
//# sourceMappingURL=docker-DO4mZ4Jo.js.map

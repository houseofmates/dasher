import { b as private_env } from './shared-server-9-2j12mp.js';
import fs from 'fs/promises';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

//#region src/lib/server/compose.ts
var execAsync = promisify(exec);
async function discoverStacks() {
	const searchDir = path.dirname(private_env.MAIN_STACK_PATH || "/home/house/Documents/docker");
	const stacks = [];
	try {
		if (private_env.MAIN_STACK_PATH && await fileExists(private_env.MAIN_STACK_PATH)) stacks.push({
			name: path.basename(path.dirname(private_env.MAIN_STACK_PATH)),
			path: private_env.MAIN_STACK_PATH
		});
		const { stdout } = await execAsync(`find ${searchDir} -name "docker-compose.ym*" -not -path "*/node_modules/*"`);
		const files = stdout.split("\n").filter((f) => f.trim() && f !== private_env.MAIN_STACK_PATH);
		for (const file of files) stacks.push({
			name: path.basename(path.dirname(file)),
			path: file
		});
	} catch (e) {
		console.error("failed to discover stacks:", e);
	}
	return stacks;
}
async function fileExists(p) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}
async function runComposeCommand(stackPath, cmd) {
	const dir = path.dirname(stackPath);
	const { stdout, stderr } = await execAsync(`docker compose -f ${stackPath} ${cmd}`, { cwd: dir });
	return {
		stdout,
		stderr
	};
}
function streamComposeCommand(stackPath, cmd) {
	const dir = path.dirname(stackPath);
	return spawn("docker", [
		"compose",
		"-f",
		stackPath,
		...cmd.split(" ")
	], { cwd: dir });
}

export { discoverStacks as d, runComposeCommand as r, streamComposeCommand as s };
//# sourceMappingURL=compose-BTNP7U-v.js.map

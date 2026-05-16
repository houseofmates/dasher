import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
const execAsync = promisify(exec);
export async function discoverStacks() {
    // Use environment variable for search directory, default to current directory if not set
    const mainPath = process.env.MAIN_STACK_PATH;
    const searchDir = mainPath ? path.dirname(path.dirname(mainPath)) : '.';
    const stacks = [];
    try {
        // start with the main stack if it exists
        if (process.env.MAIN_STACK_PATH && await fileExists(process.env.MAIN_STACK_PATH)) {
            stacks.push({
                name: path.basename(path.dirname(process.env.MAIN_STACK_PATH)),
                path: process.env.MAIN_STACK_PATH
            });
        }
        // find other stacks
        const { stdout } = await execAsync(`find ${searchDir} -name "docker-compose.ym*" -not -path "*/node_modules/*"`);
        const files = stdout.split('\n').filter(f => f.trim() && f !== process.env.MAIN_STACK_PATH);
        for (const file of files) {
            stacks.push({
                name: path.basename(path.dirname(file)),
                path: file
            });
        }
    }
    catch (e) {
        console.error('failed to discover stacks:', e);
    }
    return stacks;
}
async function fileExists(p) {
    try {
        await fs.access(p);
        return true;
    }
    catch {
        return false;
    }
}
export async function runComposeCommand(stackPath, cmd) {
    const dir = path.dirname(stackPath);
    const { stdout, stderr } = await execAsync(`docker compose -f ${stackPath} ${cmd}`, { cwd: dir });
    return { stdout, stderr };
}
export function streamComposeCommand(stackPath, cmd) {
    const dir = path.dirname(stackPath);
    // Split cmd by space but handle quoted args if necessary (simple split for now)
    const args = ['compose', '-f', stackPath, ...cmd.split(' ')];
    const process = spawn('docker', args, { cwd: dir });
    return process;
}

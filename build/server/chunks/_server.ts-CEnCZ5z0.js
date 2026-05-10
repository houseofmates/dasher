import { g as getNextApiKey } from './ai-B4nCjlVn.js';
import { j as json, e as error } from './index-CG007fFn.js';
import fs from 'fs/promises';
import path from 'path';
import docker from 'dockerode';
import './shared-server-9-2j12mp.js';
import 'dotenv';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/chat/+server.ts
var NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";
var MODEL = "deepseek-ai/deepseek-v4-pro";
var dockerClient = new docker({ socketPath: process.env.DOCKER_SOCK_PATH || "/var/run/docker.sock" });
async function readMainCompose() {
	const composePath = process.env.MAIN_STACK_PATH;
	if (!composePath) return null;
	try {
		return await fs.readFile(composePath, "utf-8");
	} catch {
		return null;
	}
}
async function listDir(dirPath, maxFiles = 40) {
	try {
		const entries = await fs.readdir(dirPath, { withFileTypes: true });
		const lines = [];
		let count = 0;
		for (const e of entries) {
			if (count >= maxFiles) {
				lines.push(`... (${entries.length - maxFiles} more)`);
				break;
			}
			lines.push(`${e.isDirectory() ? "📁" : "📄"} ${e.name}`);
			count++;
		}
		return lines.join("\n");
	} catch {
		return "(could not read directory)";
	}
}
async function resolveSlashCommand(cmd) {
	const composePath = process.env.MAIN_STACK_PATH;
	const stackDir = composePath ? path.dirname(composePath) : null;
	if (cmd === "help") return [
		"available slash commands:",
		"/help — show this list",
		"/compose — paste the full docker-compose.yml",
		"/dir <path> — list files in a directory",
		"/container <name> — inspect a running container (config, env, mounts, ports)",
		"/<service_name> — shorthand for /container <service_name>"
	].join("\n");
	if (cmd === "compose") {
		const content = await readMainCompose();
		return content ? `docker-compose.yml:\n\`\`\`yaml\n${content}\n\`\`\`` : "(MAIN_STACK_PATH not set or file not readable)";
	}
	if (cmd.startsWith("dir ")) {
		const target = cmd.slice(4).trim();
		const resolved = target.startsWith("/") ? target : stackDir ? path.join(stackDir, target) : target;
		return `directory listing for ${resolved}:\n${await listDir(resolved)}`;
	}
	const containerName = cmd.startsWith("container ") ? cmd.slice(10).trim() : cmd.trim();
	try {
		const containers = await dockerClient.listContainers({ all: true });
		const match = containers.find((c) => c.Names.some((n) => n.replace(/^\//, "") === containerName) || c.Labels["com.docker.compose.service"] === containerName);
		if (!match) return `no container found matching "${containerName}". running containers: ${containers.map((c) => c.Names[0]).join(", ")}`;
		const info = await dockerClient.getContainer(match.Id).inspect();
		const lines = [
			`container: ${containerName}`,
			`image: ${info.Config.Image}`,
			`status: ${info.State.Status}`,
			`ports: ${JSON.stringify(info.HostConfig.PortBindings ?? {})}`,
			`volumes: ${(info.Mounts ?? []).map((m) => `${m.Source}→${m.Destination}`).join(", ")}`,
			`env: ${(info.Config.Env ?? []).join(", ")}`,
			`restart: ${info.HostConfig.RestartPolicy?.Name ?? "none"}`
		];
		if (stackDir) {
			const serviceDir = path.join(stackDir, containerName);
			try {
				const dirEntries = await listDir(serviceDir, 20);
				lines.push(`\nfiles in ${serviceDir}:\n${dirEntries}`);
			} catch {}
		}
		return lines.join("\n");
	} catch (e) {
		return `error inspecting container "${containerName}": ${e}`;
	}
}
async function buildSystemPrompt() {
	const composePath = process.env.MAIN_STACK_PATH;
	const stackDir = composePath ? path.dirname(composePath) : null;
	const compose = await readMainCompose();
	const parts = [
		"you are kimi, a highly capable AI assistant embedded in a personal docker management dashboard.",
		"you have full context of the user's docker stack and can help manage, debug, and reason about containers, services, networks, and configurations.",
		"",
		"guidelines:",
		"- be concise and direct, the user is a developer",
		"- use lowercase for casual replies, but preserve code casing",
		"- when asked about a container or service, give actionable answers",
		"- slash commands (e.g. /nginx, /container nginx, /compose, /dir /etc) inject additional context into the chat",
		"",
		`stack directory: ${stackDir ?? "(not configured)"}`,
		`compose file path: ${composePath ?? "(not configured)"}`
	];
	if (compose) parts.push("", "current docker-compose.yml:", "```yaml", compose, "```");
	return parts.join("\n");
}
var POST = async ({ request }) => {
	const apiKey = getNextApiKey();
	if (!apiKey) throw error(503, "no nvidia api keys configured");
	const body = await request.json();
	let messages = body.messages ?? [];
	if (messages.length === 0 || messages[0].role !== "system") messages = [{
		role: "system",
		content: await buildSystemPrompt()
	}, ...messages];
	const lastMsg = messages[messages.length - 1];
	if (lastMsg && lastMsg.role === "user") {
		const slashMatch = (typeof lastMsg.content === "string" ? lastMsg.content : lastMsg.content.find((p) => p.type === "text")?.text ?? "").match(/^\s*\/(\S+(?:\s+\S+)*)/);
		if (slashMatch) {
			const slashCmd = slashMatch[1];
			const contextText = await resolveSlashCommand(slashCmd);
			if (typeof lastMsg.content === "string") lastMsg.content = `[context from /${slashCmd}]\n${contextText}\n\nuser: ${lastMsg.content}`;
			else {
				const textPart = lastMsg.content.find((p) => p.type === "text");
				if (textPart && textPart.text) textPart.text = `[context from /${slashCmd}]\n${contextText}\n\nuser: ${textPart.text}`;
			}
		}
	}
	const useStream = body.stream !== false;
	const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			temperature: .6,
			max_tokens: 4096,
			stream: useStream
		})
	});
	if (!response.ok) {
		const errText = await response.text();
		throw error(response.status, `nvidia api error: ${errText}`);
	}
	if (useStream) return new Response(response.body, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"X-Accel-Buffering": "no"
	} });
	return json({ content: (await response.json()).choices[0]?.message?.content ?? "" });
};
var GET = async ({ url }) => {
	const cmd = url.searchParams.get("cmd");
	if (!cmd) return json({ context: "" });
	return json({ context: await resolveSlashCommand(cmd) });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-CEnCZ5z0.js.map

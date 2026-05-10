import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNextApiKey } from '$lib/server/ai';
import fs from 'fs/promises';
import path from 'path';
import docker from 'dockerode';

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'deepseek-ai/deepseek-v4-pro';

const dockerClient = new docker({
  socketPath: process.env.DOCKER_SOCK_PATH || '/var/run/docker.sock'
});

// read docker-compose.yml from main-stack path
async function readMainCompose(): Promise<string | null> {
  const composePath = process.env.MAIN_STACK_PATH;
  if (!composePath) return null;
  try {
    const content = await fs.readFile(composePath, 'utf-8');
    return content;
  } catch {
    return null;
  }
}

// list files in a directory, up to maxFiles
async function listDir(dirPath: string, maxFiles = 40): Promise<string> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const lines: string[] = [];
    let count = 0;
    for (const e of entries) {
      if (count >= maxFiles) { lines.push(`... (${entries.length - maxFiles} more)`); break; }
      lines.push(`${e.isDirectory() ? '📁' : '📄'} ${e.name}`);
      count++;
    }
    return lines.join('\n');
  } catch {
    return '(could not read directory)';
  }
}

// resolve a slash command to context text
async function resolveSlashCommand(cmd: string): Promise<string> {
  const composePath = process.env.MAIN_STACK_PATH;
  const stackDir = composePath ? path.dirname(composePath) : null;

  // /help
  if (cmd === 'help') {
    return [
      'available slash commands:',
      '/help — show this list',
      '/compose — paste the full docker-compose.yml',
      '/dir <path> — list files in a directory',
      '/container <name> — inspect a running container (config, env, mounts, ports)',
      '/<service_name> — shorthand for /container <service_name>'
    ].join('\n');
  }

  // /compose — paste full docker-compose.yml
  if (cmd === 'compose') {
    const content = await readMainCompose();
    return content
      ? `docker-compose.yml:\n\`\`\`yaml\n${content}\n\`\`\``
      : '(MAIN_STACK_PATH not set or file not readable)';
  }

  // /dir <path>
  if (cmd.startsWith('dir ')) {
    const target = cmd.slice(4).trim();
    const resolved = target.startsWith('/') ? target : (stackDir ? path.join(stackDir, target) : target);
    const listing = await listDir(resolved);
    return `directory listing for ${resolved}:\n${listing}`;
  }

  // /container <name> or /<service_name>
  const containerName = cmd.startsWith('container ') ? cmd.slice(10).trim() : cmd.trim();
  try {
    const containers = await dockerClient.listContainers({ all: true });
    const match = containers.find(c =>
      c.Names.some(n => n.replace(/^\//, '') === containerName) ||
      c.Labels['com.docker.compose.service'] === containerName
    );
    if (!match) {
      return `no container found matching "${containerName}". running containers: ${containers.map(c => c.Names[0]).join(', ')}`;
    }
    const c = dockerClient.getContainer(match.Id);
    const info = await c.inspect();
    const lines: string[] = [
      `container: ${containerName}`,
      `image: ${info.Config.Image}`,
      `status: ${info.State.Status}`,
      `ports: ${JSON.stringify(info.HostConfig.PortBindings ?? {})}`,
      `volumes: ${(info.Mounts ?? []).map((m: { Source: string; Destination: string }) => `${m.Source}→${m.Destination}`).join(', ')}`,
      `env: ${(info.Config.Env ?? []).join(', ')}`,
      `restart: ${info.HostConfig.RestartPolicy?.Name ?? 'none'}`
    ];

    // try to read container-specific compose file if in a service directory
    if (stackDir) {
      const serviceDir = path.join(stackDir, containerName);
      try {
        const dirEntries = await listDir(serviceDir, 20);
        lines.push(`\nfiles in ${serviceDir}:\n${dirEntries}`);
      } catch { /* no service dir, that's fine */ }
    }

    return lines.join('\n');
  } catch (e) {
    return `error inspecting container "${containerName}": ${e}`;
  }
}

// build the system prompt once per conversation start
async function buildSystemPrompt(): Promise<string> {
  const composePath = process.env.MAIN_STACK_PATH;
  const stackDir = composePath ? path.dirname(composePath) : null;
  const compose = await readMainCompose();

  const parts: string[] = [
    'you are kimi, a highly capable AI assistant embedded in a personal docker management dashboard.',
    'you have full context of the user\'s docker stack and can help manage, debug, and reason about containers, services, networks, and configurations.',
    '',
    'guidelines:',
    '- be concise and direct, the user is a developer',
    '- use lowercase for casual replies, but preserve code casing',
    '- when asked about a container or service, give actionable answers',
    '- slash commands (e.g. /nginx, /container nginx, /compose, /dir /etc) inject additional context into the chat',
    '',
    `stack directory: ${stackDir ?? '(not configured)'}`,
    `compose file path: ${composePath ?? '(not configured)'}`
  ];

  if (compose) {
    parts.push('', 'current docker-compose.yml:', '```yaml', compose, '```');
  }

  return parts.join('\n');
}

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = getNextApiKey();
  if (!apiKey) throw error(503, 'no nvidia api keys configured');

  const body = await request.json() as {
    messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>;
    stream?: boolean;
  };

  // inject system prompt at start if not already present
  let messages = body.messages ?? [];
  if (messages.length === 0 || messages[0].role !== 'system') {
    const systemPrompt = await buildSystemPrompt();
    messages = [{ role: 'system', content: systemPrompt }, ...messages];
  }

  // resolve any slash commands in the latest user message
  const lastMsg = messages[messages.length - 1];
  if (lastMsg && lastMsg.role === 'user') {
    const textContent = typeof lastMsg.content === 'string'
      ? lastMsg.content
      : lastMsg.content.find(p => p.type === 'text')?.text ?? '';

    const slashMatch = textContent.match(/^\s*\/(\S+(?:\s+\S+)*)/);
    if (slashMatch) {
      const slashCmd = slashMatch[1];
      const contextText = await resolveSlashCommand(slashCmd);
      // prepend resolved context to message
      if (typeof lastMsg.content === 'string') {
        lastMsg.content = `[context from /${slashCmd}]\n${contextText}\n\nuser: ${lastMsg.content}`;
      } else {
        const textPart = lastMsg.content.find(p => p.type === 'text');
        if (textPart && textPart.text) {
          textPart.text = `[context from /${slashCmd}]\n${contextText}\n\nuser: ${textPart.text}`;
        }
      }
    }
  }

  const useStream = body.stream !== false;

  const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 4096,
      stream: useStream
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw error(response.status, `nvidia api error: ${errText}`);
  }

  if (useStream) {
    // pipe the SSE stream directly to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no'
      }
    });
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return json({ content: data.choices[0]?.message?.content ?? '' });
};

// resolve slash command without full chat (for the client to preview)
export const GET: RequestHandler = async ({ url }) => {
  const cmd = url.searchParams.get('cmd');
  if (!cmd) return json({ context: '' });
  const context = await resolveSlashCommand(cmd);
  return json({ context });
};

import http from 'node:http';
import { handler } from './build/handler.js';
import { WebSocketServer } from 'ws';
import Docker from 'dockerode';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const server = http.createServer(handler);
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  if (url.pathname === '/terminal') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

const docker = new Docker({ socketPath: process.env.DOCKER_SOCK_PATH || '/var/run/docker.sock' });

wss.on('connection', async (ws, request) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const containerId = url.searchParams.get('id');

  if (!containerId) {
    ws.close(1008, 'container id required');
    return;
  }

  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['/bin/sh', '-c', '[ -e /bin/bash ] && /bin/bash || /bin/sh']
    });

    const stream = await exec.start({ stdin: true, hijack: true });

    ws.on('message', (data) => {
      stream.write(data.toString());
    });

    stream.on('data', (chunk) => {
      ws.send(chunk.toString());
    });

    stream.on('end', () => {
      ws.close();
    });

    ws.on('close', () => {
      stream.end();
    });

  } catch (err) {
    console.error('terminal exec error:', err);
    ws.close(1011, 'failed to start exec');
  }
});

const port = process.env.PORT || 6967;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`);
});

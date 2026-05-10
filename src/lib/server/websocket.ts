import { WebSocketServer } from 'ws';
import type { Server } from 'http';
import { docker } from './docker';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    if (url.pathname === '/terminal') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

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

      // bridge ws and docker stream
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

      // handle terminal resize if needed (advanced)
      // for now, just basic interaction

    } catch (err) {
      console.error('terminal exec error:', err);
      ws.close(1011, 'failed to start exec');
    }
  });

  return wss;
}

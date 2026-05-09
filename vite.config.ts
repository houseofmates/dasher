import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';
import { setupWebSocket } from './src/lib/server/websocket';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (server.httpServer) {
			setupWebSocket(server.httpServer as any);
		}
	}
};

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), webSocketServer] });

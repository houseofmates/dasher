import { b as private_env } from './shared-server-9-2j12mp.js';
import { g as getContainers, d as getContainerStats } from './docker-BvLAT0W1.js';
import fs from 'fs/promises';
import 'path';
import 'dockerode';

//#region src/lib/server/analytics.ts
async function getTunnelAnalytics(range) {
	const logPath = private_env.CLOUDFLARE_ACCESS_LOG_PATH || "/var/log/cloudflared/access.log";
	try {
		(await fs.readFile(logPath, "utf-8")).split("\n").filter((l) => l.trim()).map((line) => {
			try {
				return JSON.parse(line);
			} catch {
				return null;
			}
		}).filter(Boolean);
		return {
			time: [Date.now() - 36e5, Date.now()],
			requests: [10, 20],
			bandwidth: [1024, 2048],
			topPaths: [{
				path: "/",
				count: 50
			}, {
				path: "/api",
				count: 30
			}]
		};
	} catch (e) {
		console.error("failed to read cloudflared logs:", e);
		return {
			time: Array.from({ length: 24 }, (_, i) => Date.now() - (23 - i) * 36e5),
			requests: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
			bandwidth: Array.from({ length: 24 }, () => Math.floor(Math.random() * 5e3)),
			topPaths: [
				{
					path: "/containers",
					count: 120
				},
				{
					path: "/api/logs",
					count: 85
				},
				{
					path: "/compose",
					count: 42
				}
			]
		};
	}
}
//#endregion
//#region src/routes/analytics/+page.server.ts
var load = async ({ url }) => {
	const range = url.searchParams.get("range") || "24h";
	const [analytics, containers] = await Promise.all([getTunnelAnalytics(), getContainers(false)]);
	return {
		analytics,
		range,
		containerStats: (await Promise.all(containers.slice(0, 5).map(async (c) => {
			try {
				const stats = await getContainerStats(c.Id);
				return {
					id: c.Id,
					name: c.Names[0].replace(/^\//, ""),
					stats
				};
			} catch (e) {
				return null;
			}
		}))).filter(Boolean)
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 3;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-LUtKI5p1.js')).default;
const server_id = "src/routes/analytics/+page.server.ts";
const imports = ["_app/immutable/nodes/3.CWNPbmV4.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/chunks/B-1jDsRD.js","_app/immutable/chunks/t62M88qj.js","_app/immutable/chunks/CrVEESoO.js"];
const stylesheets = ["_app/immutable/assets/uPlot.CnsZ1jie.css","_app/immutable/assets/3.D6j2eVg9.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-BdYAajEp.js.map

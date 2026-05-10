const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.DzBaB6jJ.js",app:"_app/immutable/entry/app.DWeO5Bx1.js",imports:["_app/immutable/entry/start.DzBaB6jJ.js","_app/immutable/chunks/DwR3r_3y.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/CL0w5ZIy.js","_app/immutable/entry/app.DWeO5Bx1.js","_app/immutable/chunks/CH3ya9no.js","_app/immutable/chunks/imS9_EF1.js","_app/immutable/chunks/DEggy0fl.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DAPUqE8U.js')),
			__memo(() => import('./chunks/1-B8uh8I98.js')),
			__memo(() => import('./chunks/2-DK6nHDp8.js')),
			__memo(() => import('./chunks/3-CXjKa5iM.js')),
			__memo(() => import('./chunks/4-CmsjsnMQ.js')),
			__memo(() => import('./chunks/5-D39hLbKB.js')),
			__memo(() => import('./chunks/6-DbIqANfR.js')),
			__memo(() => import('./chunks/7-C7XzhM06.js')),
			__memo(() => import('./chunks/8-CtpPVXIt.js')),
			__memo(() => import('./chunks/9-50OMoEcR.js')),
			__memo(() => import('./chunks/10-Bussgeqt.js')),
			__memo(() => import('./chunks/11-B80YNzPO.js')),
			__memo(() => import('./chunks/12-h0HJUB2e.js')),
			__memo(() => import('./chunks/13-DZIfGZ0Z.js')),
			__memo(() => import('./chunks/14-BR3yBx9T.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/analytics",
				pattern: /^\/analytics\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/chat",
				pattern: /^\/api\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CEnCZ5z0.js'))
			},
			{
				id: "/api/compose/content",
				pattern: /^\/api\/compose\/content\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CosiCKRD.js'))
			},
			{
				id: "/api/compose/fix",
				pattern: /^\/api\/compose\/fix\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DOgpq1d5.js'))
			},
			{
				id: "/api/compose/handler",
				pattern: /^\/api\/compose\/handler\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BgeoLFLb.js'))
			},
			{
				id: "/api/compose/run",
				pattern: /^\/api\/compose\/run\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-yUbhweLz.js'))
			},
			{
				id: "/api/compose/save",
				pattern: /^\/api\/compose\/save\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-RyHdg86t.js'))
			},
			{
				id: "/api/compose/stream",
				pattern: /^\/api\/compose\/stream\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CSgSLydy.js'))
			},
			{
				id: "/api/containers/[id]/logs",
				pattern: /^\/api\/containers\/([^/]+?)\/logs\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D19kddki.js'))
			},
			{
				id: "/api/containers/[id]/rename",
				pattern: /^\/api\/containers\/([^/]+?)\/rename\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BmWMYUwd.js'))
			},
			{
				id: "/api/containers/[id]/stats",
				pattern: /^\/api\/containers\/([^/]+?)\/stats\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DHJzP0TB.js'))
			},
			{
				id: "/api/containers/[id]/[action]",
				pattern: /^\/api\/containers\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"action","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BBA5MSm8.js'))
			},
			{
				id: "/api/events",
				pattern: /^\/api\/events\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BORV0Ydx.js'))
			},
			{
				id: "/api/images/pull",
				pattern: /^\/api\/images\/pull\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-7J-ZOPFV.js'))
			},
			{
				id: "/api/images/[id]",
				pattern: /^\/api\/images\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BcjNwZMl.js'))
			},
			{
				id: "/api/images/[id]/tag",
				pattern: /^\/api\/images\/([^/]+?)\/tag\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-kjE4iA4f.js'))
			},
			{
				id: "/api/networks/[id]",
				pattern: /^\/api\/networks\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-77gpbAFo.js'))
			},
			{
				id: "/api/test-env",
				pattern: /^\/api\/test-env\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-D7buhVGP.js'))
			},
			{
				id: "/api/volumes/[name]",
				pattern: /^\/api\/volumes\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-Zj-SrfAa.js'))
			},
			{
				id: "/chat",
				pattern: /^\/chat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/compose",
				pattern: /^\/compose\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/containers",
				pattern: /^\/containers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/containers/[id]",
				pattern: /^\/containers\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/images",
				pattern: /^\/images\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/images/[id]",
				pattern: /^\/images\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/networks",
				pattern: /^\/networks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/networks/[id]",
				pattern: /^\/networks\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/terminal",
				pattern: /^\/terminal\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/volumes",
				pattern: /^\/volumes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/volumes/[name]",
				pattern: /^\/volumes\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map

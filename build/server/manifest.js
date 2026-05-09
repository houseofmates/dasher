const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.DlOIHHvy.js",app:"_app/immutable/entry/app.A77c8fiy.js",imports:["_app/immutable/entry/start.DlOIHHvy.js","_app/immutable/chunks/CrT4uTZl.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/BSTYxbxq.js","_app/immutable/entry/app.A77c8fiy.js","_app/immutable/chunks/C8Da_q7u.js","_app/immutable/chunks/C-OaypFN.js","_app/immutable/chunks/t62M88qj.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DBTORGtz.js')),
			__memo(() => import('./chunks/1-CKZbjQea.js')),
			__memo(() => import('./chunks/2-5OUyMpwQ.js')),
			__memo(() => import('./chunks/3-BdYAajEp.js')),
			__memo(() => import('./chunks/4-89PYbG_S.js')),
			__memo(() => import('./chunks/5-CkhrJtCU.js')),
			__memo(() => import('./chunks/6-AhJs3XVs.js')),
			__memo(() => import('./chunks/7-CBPuVXxg.js')),
			__memo(() => import('./chunks/8-BtmuXgat.js')),
			__memo(() => import('./chunks/9-BCFySzKQ.js')),
			__memo(() => import('./chunks/10-DnPaFfHV.js')),
			__memo(() => import('./chunks/11-DNq4l1zB.js')),
			__memo(() => import('./chunks/12-D57AqCVf.js')),
			__memo(() => import('./chunks/13-DawgMF-S.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-BHnpvA6Y.js'))
			},
			{
				id: "/api/compose/handler",
				pattern: /^\/api\/compose\/handler\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CKvz5-2q.js'))
			},
			{
				id: "/api/compose/run",
				pattern: /^\/api\/compose\/run\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-C41jlu7c.js'))
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
				endpoint: __memo(() => import('./chunks/_server.ts-Bq4-w8YG.js'))
			},
			{
				id: "/api/containers/[id]/logs",
				pattern: /^\/api\/containers\/([^/]+?)\/logs\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-NMZkhfQ4.js'))
			},
			{
				id: "/api/containers/[id]/rename",
				pattern: /^\/api\/containers\/([^/]+?)\/rename\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-aYRXXNc5.js'))
			},
			{
				id: "/api/containers/[id]/stats",
				pattern: /^\/api\/containers\/([^/]+?)\/stats\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BhzGg2sM.js'))
			},
			{
				id: "/api/containers/[id]/[action]",
				pattern: /^\/api\/containers\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"action","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BX87ygJn.js'))
			},
			{
				id: "/api/images/pull",
				pattern: /^\/api\/images\/pull\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DMsNjhXP.js'))
			},
			{
				id: "/api/images/[id]",
				pattern: /^\/api\/images\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BJBsWP_3.js'))
			},
			{
				id: "/api/images/[id]/tag",
				pattern: /^\/api\/images\/([^/]+?)\/tag\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CSF6dJsW.js'))
			},
			{
				id: "/api/networks/[id]",
				pattern: /^\/api\/networks\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-jc_KcY9w.js'))
			},
			{
				id: "/api/volumes/[name]",
				pattern: /^\/api\/volumes\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BpD7q1sR.js'))
			},
			{
				id: "/compose",
				pattern: /^\/compose\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/containers",
				pattern: /^\/containers\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/containers/[id]",
				pattern: /^\/containers\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/images",
				pattern: /^\/images\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/images/[id]",
				pattern: /^\/images\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/networks",
				pattern: /^\/networks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/networks/[id]",
				pattern: /^\/networks\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/terminal",
				pattern: /^\/terminal\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/volumes",
				pattern: /^\/volumes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/volumes/[name]",
				pattern: /^\/volumes\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
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

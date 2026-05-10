import { b as private_env } from './shared-server-9-2j12mp.js';
import { g as getNextApiKey } from './ai-B4nCjlVn.js';
import { j as json } from './index-CG007fFn.js';
import 'dotenv';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/debug-env/+server.ts
var GET = async () => {
	return json({
		processEnvKeys: Object.keys(process.env).filter((k) => k.startsWith("NVIDIA_API_KEY")).length,
		svelteEnvKeys: Object.keys(private_env).filter((k) => k.startsWith("NVIDIA_API_KEY")).length,
		processEnvSample: process.env.NVIDIA_API_KEY_1 ? "present" : "missing",
		svelteEnvSample: private_env.NVIDIA_API_KEY_1 ? "present" : "missing",
		getNextApiKeyResult: getNextApiKey(),
		envObjectKeys: Object.keys(private_env).slice(0, 10),
		allProcessKeys: Object.keys(process.env).filter((k) => k.includes("NVIDIA"))
	});
};

export { GET };
//# sourceMappingURL=_server.ts-Bhu86ezh.js.map

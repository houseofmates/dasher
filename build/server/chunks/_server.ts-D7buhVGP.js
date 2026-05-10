import { b as private_env } from './shared-server-9-2j12mp.js';
import { g as getNextApiKey } from './ai-B4nCjlVn.js';
import { j as json } from './index-CG007fFn.js';
import 'dotenv';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/test-env/+server.ts
var GET = async () => {
	const nvidiaKeys = Object.entries(private_env).filter(([key]) => key.startsWith("NVIDIA_API_KEY_")).sort(([a], [b]) => {
		return parseInt(a.replace("NVIDIA_API_KEY_", ""), 10) - parseInt(b.replace("NVIDIA_API_KEY_", ""), 10);
	});
	const firstKey = getNextApiKey();
	return json({
		totalKeys: nvidiaKeys.length,
		keysExist: nvidiaKeys.map(([key]) => key),
		firstKeyAvailable: !!firstKey,
		firstKeyPreview: firstKey ? firstKey.substring(0, 10) + "..." : null
	});
};

export { GET };
//# sourceMappingURL=_server.ts-D7buhVGP.js.map

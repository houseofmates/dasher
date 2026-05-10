import { b as private_env } from './shared-server-9-2j12mp.js';
import { config } from 'dotenv';

//#region src/lib/server/ai.ts
config();
if (!process.env.NVIDIA_API_KEY_1 && private_env.NVIDIA_API_KEY_1) process.env.NVIDIA_API_KEY_1 = private_env.NVIDIA_API_KEY_1;
var keyIndex = 0;
function getNextApiKey() {
	const keys = Object.entries(private_env).filter(([key]) => key.startsWith("NVIDIA_API_KEY_")).sort(([a], [b]) => {
		return parseInt(a.replace("NVIDIA_API_KEY_", ""), 10) - parseInt(b.replace("NVIDIA_API_KEY_", ""), 10);
	}).map(([_, value]) => value).filter(Boolean);
	if (keys.length === 0) return null;
	const key = keys[keyIndex % keys.length];
	keyIndex = (keyIndex + 1) % keys.length;
	return key;
}

export { getNextApiKey as g };
//# sourceMappingURL=ai-reSsAS0i.js.map

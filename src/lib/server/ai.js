import { config } from 'dotenv';
import { getAiConfig } from './db';
// Load environment variables explicitly
config();
let keyIndex = 0;
function getEnvKeys() {
    if (!process.env.NVIDIA_API_KEY_1) {
        config();
    }
    return Object.entries(process.env)
        .filter(([key]) => key.startsWith('NVIDIA_API_KEY_'))
        .sort(([a], [b]) => {
        const numA = parseInt(a.replace('NVIDIA_API_KEY_', ''), 10);
        const numB = parseInt(b.replace('NVIDIA_API_KEY_', ''), 10);
        return numA - numB;
    })
        .map(([_, value]) => value)
        .filter(Boolean);
}
export function getNextApiKey() {
    const envKeys = getEnvKeys();
    if (envKeys.length > 0) {
        const key = envKeys[keyIndex % envKeys.length];
        keyIndex = (keyIndex + 1) % envKeys.length;
        return key;
    }
    // Fallback to SQLite config
    const cfg = getAiConfig();
    if (cfg?.api_key)
        return cfg.api_key;
    return null;
}
export function getAiModel() {
    const cfg = getAiConfig();
    return cfg?.model || 'deepseek-ai/deepseek-v4-pro';
}
export function getAiEndpoint() {
    const cfg = getAiConfig();
    return cfg?.endpoint || 'https://integrate.api.nvidia.com/v1/chat/completions';
}
export async function fixYaml(yaml, error) {
    const apiKey = getNextApiKey();
    if (!apiKey)
        throw new Error('no api keys configured. add NVIDIA_API_KEY_1 to .env or configure in settings.');
    const model = getAiModel();
    const endpoint = getAiEndpoint();
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: 'system',
                    content: 'you are a docker compose expert. fix the following yaml content based on the error provided. return only the corrected yaml code, no explanation.'
                },
                {
                    role: 'user',
                    content: `YAML:\n${yaml}\n\nERROR:\n${error}`
                }
            ],
            temperature: 0.2
        })
    });
    if (!response.ok) {
        const errText = await response.text().catch(() => 'unknown error');
        throw new Error(`AI API error: ${response.status} ${errText}`);
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content)
        throw new Error('invalid AI response format');
    return content.replace(/```yaml|```/g, '').trim();
}

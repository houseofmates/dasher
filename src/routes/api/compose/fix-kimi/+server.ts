import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import yaml from 'js-yaml';

const apiKeys = [];
for (let i = 1; i <= 100; i++) {
  const key = process.env[`NVIDIA_API_KEY_${i}`];
  if (key) apiKeys.push(key);
}
let currentKeyIndex = 0;

function getNextKey() {
  if (!apiKeys.length) throw new Error('No NVIDIA keys');
  const k = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return k;
}

async function callKimi(yaml: string, warning?: string) {
  const key = getNextKey();
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2.6',
      messages: [
        { role: 'system', content: 'Return only valid YAML. Fix: ' + (warning || 'error') },
        { role: 'user', content: yaml }
      ],
      temperature: 0.1,
      max_tokens: 4096
    })
  });
  
  const text = await res.text();
  if (!res.ok) throw new Error(`NVIDIA ${res.status}: ${text.slice(0,200)}`);
  
  const data = JSON.parse(text);
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from Kimi');
  
  return content;
}

export const POST: RequestHandler = async ({ request }) => {
  const { yaml: content, warning } = await request.json();
  if (!content) return json({ error: 'No YAML' }, { status: 400 });
  if (!apiKeys.length) return json({ error: 'No NVIDIA keys' }, { status: 503 });

  try {
    const parsed = yaml.load(content);
    return json({ fixed: yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true }) });
  } catch {}
  
  try {
    const fixed = await callKimi(content, warning);
    yaml.load(fixed); // validate
    return json({ fixed, message: 'fixed by Kimi' });
  } catch (kimiErr) {
    // Fallback to Llama via NVIDIA (existing endpoint logic)
    try {
      const llamaRes = await fetch('/api/compose/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml: content, error: kimiErr.message })
      });
      const llamaData = await llamaRes.json();
      if (llamaRes.ok && llamaData.fixed) {
        yaml.load(llamaData.fixed);
        return json({ fixed: llamaData.fixed, message: 'fixed by Llama fallback' });
      }
      return json({ error: kimiErr.message + '; fallback also failed: ' + (llamaData.error || 'unknown') }, { status: 500 });
    } catch (fallbackErr) {
      return json({ error: kimiErr.message + '; fallback error: ' + fallbackErr.message }, { status: 500 });
    }
  }
};

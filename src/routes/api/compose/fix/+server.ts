import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import yaml from 'js-yaml';

const API_KEYS = Object.keys(process.env)
  .filter(key => key.startsWith('NVIDIA_API_KEY_'))
  .map(key => process.env[key])
  .filter(Boolean) as string[];

let currentKeyIndex = 0;

export const POST: RequestHandler = async ({ request }) => {
  const { yaml: content, error } = await request.json();

  // Try standard linting first
  try {
    const parsed = yaml.load(content);
    const formatted = yaml.dump(parsed, { indent: 2, lineWidth: -1, noRefs: true });
    return json({ fixed: formatted, message: 'yaml formatted correctly' });
  } catch (lintErr: any) {
    // If linting fails, use AI to fix it
    if (API_KEYS.length === 0) {
      return json({ error: lintErr.message, message: 'lint error (no ai keys available)' }, { status: 400 });
    }

    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: "You are a specialized Docker Compose YAML fixing assistant. Your ONLY job is to take a broken Docker Compose file and return a valid, fixed version. DO NOT explain anything. DO NOT include markdown code blocks. Just return the raw YAML."
            },
            {
              role: "user",
              content: `The following Docker Compose file has an error: ${error}\n\nBroken YAML:\n${content}`
            }
          ],
          temperature: 0.1,
          max_tokens: 4096
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'ai api error');

      const fixed = data.choices[0].message.content.trim();
      
      // Validate the AI fixed it
      try {
        yaml.load(fixed);
        return json({ fixed, message: 'yaml fixed by ai' });
      } catch (validateErr: any) {
        return json({ error: validateErr.message, message: 'ai failed to provide valid yaml' }, { status: 400 });
      }
    } catch (aiErr: any) {
      return json({ error: aiErr.message, message: 'ai service error' }, { status: 500 });
    }
  }
};

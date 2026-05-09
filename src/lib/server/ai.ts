import { env } from '$env/dynamic/private';

let keyIndex = 0;

function getNextApiKey() {
  const keys = Object.entries(env)
    .filter(([key]) => key.startsWith('NVIDIA_API_KEY_'))
    .map(([_, value]) => value);
  
  if (keys.length === 0) return null;
  
  const key = keys[keyIndex % keys.length];
  keyIndex++;
  return key;
}

export async function fixYaml(yaml: string, error: string) {
  const apiKey = getNextApiKey();
  if (!apiKey) throw new Error('no nvidia api keys configured');

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-v4-pro',
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

  const data = await response.json();
  return data.choices[0].message.content.replace(/```yaml|```/g, '').trim();
}

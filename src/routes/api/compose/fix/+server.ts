import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import yaml from 'js-yaml';

export const POST: RequestHandler = async ({ request }) => {
  const { yaml: content, error } = await request.json();

  try {
    // Attempt to parse the YAML
    const parsed = yaml.load(content);
    
    // If it parses, maybe we just re-stringity it to "clean" it
    const fixed = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });

    return json({ 
      fixed, 
      message: 'yaml linted and formatted' 
    });
  } catch (err: any) {
    // If it fails to parse, we could try some basic heuristic fixes or just report the error
    return json({ 
      error: err.message,
      message: 'failed to fix yaml' 
    }, { status: 400 });
  }
};

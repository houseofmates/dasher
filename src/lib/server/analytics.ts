import fs from 'fs/promises';

const mockAnalytics = {
  time: Array.from({length: 24}, (_, i) => Date.now() - (23-i) * 3600000),
  requests: Array.from({length: 24}, () => Math.floor(Math.random() * 100)),
  bandwidth: Array.from({length: 24}, () => Math.floor(Math.random() * 5000)),
  topPaths: [
    { path: '/containers', count: 120 },
    { path: '/api/logs', count: 85 },
    { path: '/compose', count: 42 }
  ]
};

export async function getTunnelAnalytics(range: string) {
  const logPath = process.env.CLOUDFLARE_ACCESS_LOG_PATH || '/var/log/cloudflared/access.log';
  
  try {
    const content = await fs.readFile(logPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    
    // placeholder parsing logic - assuming JSON or common log format
    // we'll simulate data if parsing fails or log is empty for the demo
    const data = lines.map(line => {
      try {
        // assume JSON for now, or regex for common log
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);

    // aggregate by timestamp
    // ... logic to aggregate based on range ...
    
    return {
      time: [Date.now() - 3600000, Date.now()],
      requests: [10, 20],
      bandwidth: [1024, 2048],
      topPaths: [
        { path: '/', count: 50 },
        { path: '/api', count: 30 }
      ]
    };
  } catch (e) {
    console.error('failed to read cloudflared logs:', e);
    // return persistent mock data for initial UI dev
    return mockAnalytics;
  }
}

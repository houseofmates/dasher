import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = process.env.DB_PATH ? path.dirname(process.env.DB_PATH) : path.resolve('data');
const DB_PATH = process.env.DB_PATH || path.resolve('data', 'dasher.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS container_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      container_id TEXT NOT NULL,
      container_name TEXT,
      cpu_percent REAL,
      ram_percent REAL,
      ram_bytes INTEGER,
      net_in INTEGER,
      net_out INTEGER,
      timestamp INTEGER DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_stats_container_time 
      ON container_stats(container_id, timestamp);

    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS pinned_containers (
      container_id TEXT PRIMARY KEY,
      container_name TEXT,
      pinned_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      container_id TEXT,
      read INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_notifications_unread 
      ON notifications(read, created_at);

    CREATE TABLE IF NOT EXISTS ai_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      provider TEXT DEFAULT 'nvidia',
      api_key TEXT,
      model TEXT DEFAULT 'deepseek-ai/deepseek-v4-pro',
      endpoint TEXT,
      updated_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS resource_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      container_id TEXT,
      metric TEXT,
      threshold REAL,
      triggered_at INTEGER DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS vulnerability_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_id TEXT NOT NULL,
      image_name TEXT NOT NULL,
      scan_data TEXT, -- JSON data
      summary TEXT, -- JSON summary
      scanned_at INTEGER DEFAULT (unixepoch()),
      scan_duration INTEGER,
      scan_type TEXT DEFAULT 'trivy'
    );
    CREATE INDEX IF NOT EXISTS idx_vuln_scans_image 
      ON vulnerability_scans(image_id, scanned_at DESC);
  `);
}

initSchema();

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGINT', () => { db.close(); process.exit(0); });
process.on('SIGTERM', () => { db.close(); process.exit(0); });

// ─── Settings ───────────────────────────────────────────────

export function getSetting(key: string, defaultValue?: string): string | undefined {
  const row = db.prepare('SELECT value FROM user_settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? defaultValue;
}

export function setSetting(key: string, value: string) {
  db.prepare(`
    INSERT INTO user_settings (key, value, updated_at) VALUES (?, ?, unixepoch())
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(key, value);
}

export function getAllSettings(): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM user_settings').all() as { key: string; value: string }[];
  return rows.reduce((acc, r) => { acc[r.key] = r.value; return acc; }, {} as Record<string, string>);
}

// ─── Pinned Containers ──────────────────────────────────────

export function getPinnedContainers(): { container_id: string; container_name: string; pinned_at: number }[] {
  return db.prepare('SELECT * FROM pinned_containers ORDER BY pinned_at DESC').all() as any[];
}

export function pinContainer(containerId: string, containerName: string) {
  db.prepare(`
    INSERT INTO pinned_containers (container_id, container_name, pinned_at) VALUES (?, ?, unixepoch())
    ON CONFLICT(container_id) DO UPDATE SET container_name = excluded.container_name, pinned_at = excluded.pinned_at
  `).run(containerId, containerName);
}

export function unpinContainer(containerId: string) {
  db.prepare('DELETE FROM pinned_containers WHERE container_id = ?').run(containerId);
}

export function isPinned(containerId: string): boolean {
  const row = db.prepare('SELECT 1 FROM pinned_containers WHERE container_id = ?').get(containerId) as any;
  return !!row;
}

// ─── Container Stats ────────────────────────────────────────

export interface StatRecord {
  container_id: string;
  container_name?: string;
  cpu_percent: number;
  ram_percent: number;
  ram_bytes: number;
  net_in: number;
  net_out: number;
  timestamp: number;
}

export function insertContainerStats(record: Omit<StatRecord, 'timestamp'>) {
  db.prepare(`
    INSERT INTO container_stats (container_id, container_name, cpu_percent, ram_percent, ram_bytes, net_in, net_out, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch())
  `).run(
    record.container_id,
    record.container_name || null,
    record.cpu_percent,
    record.ram_percent,
    record.ram_bytes,
    record.net_in,
    record.net_out
  );
}

export function getContainerStatsHistory(containerId: string, hours = 24): StatRecord[] {
  const since = Math.floor(Date.now() / 1000) - hours * 3600;
  return db.prepare(`
    SELECT * FROM container_stats 
    WHERE container_id = ? AND timestamp > ? 
    ORDER BY timestamp ASC
  `).all(containerId, since) as StatRecord[];
}

export function getContainerStatsAggregated(
  containerId: string, 
  hours = 24, 
  aggregation: 'hourly' | 'daily' = 'hourly'
): StatRecord[] {
  const since = Math.floor(Date.now() / 1000) - hours * 3600;
  const timeFormat = aggregation === 'hourly' 
    ? 'strftime("%Y-%m-%d %H:00:00", datetime(timestamp, "unixepoch"))'
    : 'strftime("%Y-%m-%d", datetime(timestamp, "unixepoch"))';
    
  return db.prepare(`
    SELECT 
      container_id,
      container_name,
      AVG(cpu_percent) as cpu_percent,
      AVG(ram_percent) as ram_percent,
      AVG(ram_bytes) as ram_bytes,
      AVG(net_in) as net_in,
      AVG(net_out) as net_out,
      MIN(timestamp) as timestamp
    FROM container_stats 
    WHERE container_id = ? AND timestamp > ? 
    GROUP BY ${timeFormat}
    ORDER BY timestamp ASC
  `).all(containerId, since) as StatRecord[];
}

export function getContainerStatsSummary(containerId: string, hours = 24) {
  const since = Math.floor(Date.now() / 1000) - hours * 3600;
  return db.prepare(`
    SELECT 
      COUNT(*) as data_points,
      AVG(cpu_percent) as avg_cpu,
      MAX(cpu_percent) as max_cpu,
      AVG(ram_percent) as avg_ram,
      MAX(ram_percent) as max_ram,
      AVG(ram_bytes) as avg_ram_bytes,
      MAX(ram_bytes) as max_ram_bytes,
      SUM(net_in) as total_net_in,
      SUM(net_out) as total_net_out,
      MIN(timestamp) as first_record,
      MAX(timestamp) as last_record
    FROM container_stats 
    WHERE container_id = ? AND timestamp > ?
  `).get(containerId, since) as any;
}

export function pruneOldStats(days = 7) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  const result = db.prepare('DELETE FROM container_stats WHERE timestamp < ?').run(since);
  console.log(`Pruned ${result.changes} old stats records (older than ${days} days)`);
  return result.changes;
}

export function optimizeStatsDatabase() {
  // Run VACUUM to reclaim space and optimize performance
  try {
    db.exec('VACUUM');
    db.exec('ANALYZE');
    console.log('Database optimized successfully');
  } catch (e) {
    console.error('Database optimization failed:', e);
  }
}

export function getStatsDatabaseInfo() {
  return {
    size: db.prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()').get() as { size: number },
    records: db.prepare('SELECT COUNT(*) as count FROM container_stats').get() as { count: number },
    containers: db.prepare('SELECT COUNT(DISTINCT container_id) as count FROM container_stats').get() as { count: number },
    oldestRecord: db.prepare('SELECT MIN(timestamp) as oldest FROM container_stats').get() as { oldest: number },
    newestRecord: db.prepare('SELECT MAX(timestamp) as newest FROM container_stats').get() as { newest: number }
  };
}

// ─── Notifications ──────────────────────────────────────────

export interface Notification {
  id: number;
  type: string;
  message: string;
  container_id?: string;
  read: number;
  created_at: number;
}

export function addNotification(type: string, message: string, containerId?: string) {
  return db.prepare(`
    INSERT INTO notifications (type, message, container_id, created_at) VALUES (?, ?, ?, unixepoch())
  `).run(type, message, containerId || null);
}

export function getUnreadNotifications(): Notification[] {
  return db.prepare(`
    SELECT * FROM notifications WHERE read = 0 ORDER BY created_at DESC LIMIT 50
  `).all() as Notification[];
}

export function getAllNotifications(): Notification[] {
  return db.prepare(`
    SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100
  `).all() as Notification[];
}

export function markNotificationRead(id: number) {
  db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
}

export function markAllNotificationsRead() {
  db.prepare('UPDATE notifications SET read = 1').run();
}

export function clearOldNotifications(days = 30) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  db.prepare('DELETE FROM notifications WHERE created_at < ?').run(since);
}

// ─── AI Config ──────────────────────────────────────────────

export interface AiConfig {
  provider: string;
  api_key: string | null;
  model: string;
  endpoint: string | null;
}

export function getAiConfig(): AiConfig | null {
  const row = db.prepare('SELECT * FROM ai_config WHERE id = 1').get() as AiConfig | undefined;
  return row || null;
}

export function setAiConfig(config: Partial<AiConfig>) {
  const existing = getAiConfig();
  const values = {
    provider: config.provider ?? existing?.provider ?? 'nvidia',
    api_key: config.api_key ?? existing?.api_key ?? null,
    model: config.model ?? existing?.model ?? 'deepseek-ai/deepseek-v4-pro',
    endpoint: config.endpoint ?? existing?.endpoint ?? null
  };
  db.prepare(`
    INSERT INTO ai_config (id, provider, api_key, model, endpoint, updated_at) 
    VALUES (1, ?, ?, ?, ?, unixepoch())
    ON CONFLICT(id) DO UPDATE SET 
      provider = excluded.provider,
      api_key = excluded.api_key,
      model = excluded.model,
      endpoint = excluded.endpoint,
      updated_at = excluded.updated_at
  `).run(values.provider, values.api_key, values.model, values.endpoint);
}

// ─── Vulnerability Scan Results ───────────────────────────

export interface VulnerabilityScan {
  id: number;
  image_id: string;
  image_name: string;
  scan_data: any;
  summary: any;
  scanned_at: number;
  scan_duration: number;
  scan_type: string;
}

export function saveVulnerabilityScan(imageId: string, imageName: string, scanData: any, summary: any, scanDuration: number, scanType = 'trivy') {
  return db.prepare(`
    INSERT INTO vulnerability_scans (image_id, image_name, scan_data, summary, scanned_at, scan_duration, scan_type)
    VALUES (?, ?, ?, ?, unixepoch(), ?, ?)
  `).run(imageId, imageName, JSON.stringify(scanData), JSON.stringify(summary), scanDuration, scanType);
}

export function getLatestVulnerabilityScan(imageId: string): VulnerabilityScan | null {
  const row = db.prepare(`
    SELECT * FROM vulnerability_scans 
    WHERE image_id = ? 
    ORDER BY scanned_at DESC 
    LIMIT 1
  `).get(imageId) as any;
  
  if (!row) return null;
  
  return {
    ...row,
    scan_data: JSON.parse(row.scan_data),
    summary: JSON.parse(row.summary)
  };
}

export function getVulnerabilityScanHistory(imageId: string, limit = 10): VulnerabilityScan[] {
  const rows = db.prepare(`
    SELECT * FROM vulnerability_scans 
    WHERE image_id = ? 
    ORDER BY scanned_at DESC 
    LIMIT ?
  `).all(imageId, limit) as any[];
  
  return rows.map(row => ({
    ...row,
    scan_data: JSON.parse(row.scan_data),
    summary: JSON.parse(row.summary)
  }));
}

export function shouldScanImage(imageId: string, maxAgeHours = 24): boolean {
  const latest = getLatestVulnerabilityScan(imageId);
  if (!latest) return true;
  
  const ageHours = (Date.now() / 1000 - latest.scanned_at) / 3600;
  return ageHours > maxAgeHours;
}

export function pruneOldVulnerabilityScans(days = 30) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  const result = db.prepare('DELETE FROM vulnerability_scans WHERE scanned_at < ?').run(since);
  console.log(`Pruned ${result.changes} old vulnerability scans (older than ${days} days)`);
  return result.changes;
}

// ─── Resource Alerts ────────────────────────────────────────

export function recordAlert(containerId: string, metric: string, threshold: number) {
  db.prepare(`
    INSERT INTO resource_alerts (container_id, metric, threshold, triggered_at) VALUES (?, ?, ?, unixepoch())
  `).run(containerId, metric, threshold);
}

export function getRecentAlerts(containerId: string, metric: string, minutes = 15) {
  const since = Math.floor(Date.now() / 1000) - minutes * 60;
  return db.prepare(`
    SELECT * FROM resource_alerts 
    WHERE container_id = ? AND metric = ? AND triggered_at > ?
    ORDER BY triggered_at DESC
  `).all(containerId, metric, since) as any[];
}

export function pruneOldAlerts(days = 7) {
  const since = Math.floor(Date.now() / 1000) - days * 86400;
  db.prepare('DELETE FROM resource_alerts WHERE triggered_at < ?').run(since);
}

export { db };

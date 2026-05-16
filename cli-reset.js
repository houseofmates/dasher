#!/usr/bin/env node

import { db } from './src/lib/server/db.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.resolve('data', 'dasher.db');

console.log('🔧 Dasher Dashboard - Reset Tool\n');

// Check if database exists
if (!fs.existsSync(DB_PATH)) {
  console.log('✅ No database found. Nothing to reset.');
  process.exit(0);
}

console.log(`📍 Database location: ${DB_PATH}`);

try {
  // Reset user settings to defaults
  db.prepare(`
    DELETE FROM user_settings WHERE key IN ('alert_cpu_threshold', 'alert_ram_threshold', 'theme', 'auto_refresh_interval')
  `).run();

  // Reset AI config
  db.prepare(`
    UPDATE ai_config SET 
      api_key = NULL,
      endpoint = NULL,
      model = 'deepseek-ai/deepseek-v4-pro',
      updated_at = unixepoch()
    WHERE id = 1
  `).run();

  // Clear all notifications
  db.prepare('DELETE FROM notifications').run();

  // Clear pinned containers
  db.prepare('DELETE FROM pinned_containers').run();

  // Clear resource alerts
  db.prepare('DELETE FROM resource_alerts').run();

  // Optional: Clear stats history (ask user)
  const args = process.argv.slice(2);
  if (args.includes('--clear-stats')) {
    db.prepare('DELETE FROM container_stats').run();
    console.log('🗑️  Cleared container stats history');
  }

  console.log('✅ Successfully reset Dasher dashboard to defaults');
  console.log('🔑 AI API key cleared');
  console.log('📊 Notifications cleared');
  console.log('📌 Pinned containers cleared');
  console.log('⚙️  Settings reset to defaults');
  
  if (!args.includes('--clear-stats')) {
    console.log('\n💡 To also clear stats history, run: node cli-reset.js --clear-stats');
  }

} catch (error) {
  console.error('❌ Reset failed:', error.message);
  process.exit(1);
} finally {
  db.close();
}

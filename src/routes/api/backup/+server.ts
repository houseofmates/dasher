import { json } from '@sveltejs/kit';
import { createBackup, restoreBackup } from '$lib/server/backup';
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

const BACKUP_DIR = process.env.BACKUP_DIR || path.resolve('backups');

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, backupPath, restoreVolumes } = body;

    if (action === 'create') {
      await fs.mkdir(BACKUP_DIR, { recursive: true });
      const result = await createBackup(BACKUP_DIR);
      return json({ success: true, data: result });
    } else if (action === 'restore' && backupPath) {
      const restored = await restoreBackup(backupPath, restoreVolumes !== false);
      return json({ success: true, data: { restored } });
    } else {
      return json({ success: false, error: 'Invalid action or missing backupPath' }, { status: 400 });
    }
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const files = await fs.readdir(BACKUP_DIR);
    const backups = [];

    for (const file of files) {
      if (file.endsWith('.tar.gz')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stat = await fs.stat(filePath);
        
        // Extract manifest to show backup contents
        let manifest = null;
        try {
          const { exec } = require('child_process');
          const { promisify } = require('util');
          const execAsync = promisify(exec);
          const { stdout } = await execAsync(`tar -tzf ${filePath} manifest.json 2>/dev/null || echo ''`);
          if (stdout.trim()) {
            const { exec: tarExec } = require('child_process');
            const { promisify: tarPromisify } = require('util');
            const tarExecAsync = tarPromisify(tarExec);
            const { stdout: manifestContent } = await tarExecAsync(`tar -xzf ${filePath} manifest.json -O 2>/dev/null || echo '{}'`);
            manifest = JSON.parse(manifestContent);
          }
        } catch (e) {
          // Ignore manifest extraction errors
        }
        
        backups.push({
          name: file,
          path: filePath,
          size: stat.size,
          created: stat.birthtime.toISOString(),
          modified: stat.mtime.toISOString(),
          contents: manifest?.contents || [],
          hostname: manifest?.hostname || 'unknown',
          version: manifest?.version || '1.0'
        });
      }
    }

    return json({ success: true, data: backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { backupPath } = body;
    
    if (!backupPath) {
      return json({ success: false, error: 'backupPath is required' }, { status: 400 });
    }
    
    await fs.unlink(backupPath);
    return json({ success: true });
  } catch (error: any) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
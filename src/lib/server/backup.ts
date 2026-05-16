import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { discoverStacks } from './compose';

const execAsync = promisify(exec);

export interface BackupResult {
  path: string;
  size: number;
  timestamp: string;
  contents: string[];
}

export async function createBackup(outputDir: string): Promise<BackupResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `docker-backup-${timestamp}.tar.gz`;
  const backupPath = path.join(outputDir, backupName);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Create temp staging directory
  const staging = path.join(outputDir, `.staging-${timestamp}`);
  await fs.mkdir(staging, { recursive: true });

  const contents: string[] = [];

  try {
    // 1. Copy compose files
    const composeDir = path.join(staging, 'compose');
    await fs.mkdir(composeDir, { recursive: true });

    const stacks = await discoverStacks();
    for (const stack of stacks) {
      try {
        const dest = path.join(composeDir, path.basename(path.dirname(stack.path)), path.basename(stack.path));
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.copyFile(stack.path, dest);
        contents.push(`compose/${path.basename(path.dirname(stack.path))}/${path.basename(stack.path)}`);
      } catch (e) {
        console.error(`failed to backup stack ${stack.path}:`, e);
      }
    }

    // 2. Backup named volumes
    const volumesDir = path.join(staging, 'volumes');
    await fs.mkdir(volumesDir, { recursive: true });

    const { stdout: volList } = await execAsync('docker volume ls -q');
    const volumes = volList.split('\n').filter(v => v.trim());

    for (const vol of volumes) {
      try {
        // Skip system/buildkit volumes
        if (vol.startsWith('buildx_') || vol.includes('kubelet')) continue;
        const volBackup = path.join(volumesDir, `${vol}.tar.gz`);
        await execAsync(`docker run --rm -v ${vol}:/source:ro -v ${volumesDir}:/backup busybox tar czf /backup/${vol}.tar.gz -C /source .`);
        contents.push(`volumes/${vol}.tar.gz`);
      } catch (e) {
        console.error(`failed to backup volume ${vol}:`, e);
      }
    }

    // 3. Backup SQLite database if it exists
    const dbPath = process.env.DB_PATH || path.resolve('data', 'dasher.db');
    try {
      await fs.access(dbPath);
      await fs.copyFile(dbPath, path.join(staging, 'dasher.db'));
      contents.push('dasher.db');
    } catch {
      // db doesn't exist, skip
    }

    // 4. Metadata
    const meta = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      hostname: require('os').hostname(),
      contents
    };
    await fs.writeFile(path.join(staging, 'manifest.json'), JSON.stringify(meta, null, 2));
    contents.push('manifest.json');

    // 5. Create tarball
    await execAsync(`tar czf ${backupPath} -C ${staging} .`);
    const stat = await fs.stat(backupPath);

    return {
      path: backupPath,
      size: stat.size,
      timestamp,
      contents
    };
  } finally {
    // Cleanup staging
    try {
      await fs.rm(staging, { recursive: true, force: true });
    } catch {}
  }
}

export async function restoreBackup(backupPath: string, restoreVolumes = true): Promise<string[]> {
  const restored: string[] = [];
  const staging = path.join(path.dirname(backupPath), `.restore-${Date.now()}`);

  await fs.mkdir(staging, { recursive: true });

  try {
    // Extract
    await execAsync(`tar xzf ${backupPath} -C ${staging}`);

    // Check manifest
    let manifest: any = {};
    try {
      const manifestRaw = await fs.readFile(path.join(staging, 'manifest.json'), 'utf-8');
      manifest = JSON.parse(manifestRaw);
    } catch {}

    // Restore compose files
    const composeDir = path.join(staging, 'compose');
    try {
      const entries = await fs.readdir(composeDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const stackDir = path.join(composeDir, entry.name);
          const files = await fs.readdir(stackDir);
          for (const file of files) {
            if (file.includes('docker-compose') || file.includes('compose')) {
              // Find original location or use current working dir
              const destDir = path.resolve('restored-stacks', entry.name);
              await fs.mkdir(destDir, { recursive: true });
              await fs.copyFile(path.join(stackDir, file), path.join(destDir, file));
              restored.push(`compose/${entry.name}/${file}`);
            }
          }
        }
      }
    } catch {
      // no compose dir
    }

    // Restore volumes
    if (restoreVolumes) {
      const volumesDir = path.join(staging, 'volumes');
      try {
        const files = await fs.readdir(volumesDir);
        for (const file of files) {
          if (file.endsWith('.tar.gz')) {
            const volName = file.replace('.tar.gz', '');
            // Create volume if not exists
            try {
              await execAsync(`docker volume create ${volName}`);
            } catch {
              // may already exist
            }
            await execAsync(`docker run --rm -v ${volName}:/target -v ${volumesDir}:/backup busybox sh -c "cd /target && tar xzf /backup/${file}"`);
            restored.push(`volumes/${volName}`);
          }
        }
      } catch {
        // no volumes dir
      }
    }

    // Restore database
    const dbSrc = path.join(staging, 'dasher.db');
    try {
      await fs.access(dbSrc);
      const dbDest = process.env.DB_PATH || path.resolve('data', 'dasher.db');
      await fs.mkdir(path.dirname(dbDest), { recursive: true });
      await fs.copyFile(dbSrc, dbDest);
      restored.push('dasher.db');
    } catch {
      // no db in backup
    }

    return restored;
  } finally {
    try {
      await fs.rm(staging, { recursive: true, force: true });
    } catch {}
  }
}

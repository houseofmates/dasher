import { docker, getContainers } from './docker';
import { insertContainerStats, addNotification, getRecentAlerts, recordAlert, pruneOldStats, pruneOldAlerts, clearOldNotifications, getSetting, setSetting, optimizeStatsDatabase } from './db';
let isRunning = false;
let intervalId = null;
export function startMonitor(collectionIntervalMs = 30000) {
    if (isRunning)
        return;
    isRunning = true;
    // Run immediately, then on interval
    collectStats();
    intervalId = setInterval(collectStats, collectionIntervalMs);
    // Prune old data every hour
    setInterval(() => {
        const prunedStats = pruneOldStats(7);
        pruneOldAlerts(7);
        clearOldNotifications(30);
        // Optimize database daily (check if it's been more than 24 hours)
        const lastOptimization = getSetting('last_db_optimization');
        const now = Math.floor(Date.now() / 1000);
        if (!lastOptimization || now - parseInt(lastOptimization) > 86400) {
            optimizeStatsDatabase();
            setSetting('last_db_optimization', now.toString());
        }
    }, 3600000);
}
export function stopMonitor() {
    isRunning = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
async function collectStats() {
    try {
        const containers = await getContainers(true);
        const cpuThreshold = parseFloat(getSetting('alert_cpu_threshold') || '90');
        const ramThreshold = parseFloat(getSetting('alert_ram_threshold') || '90');
        for (const c of containers) {
            if (c.State !== 'running')
                continue;
            try {
                const container = docker.getContainer(c.Id);
                const stats = await container.stats({ stream: false });
                const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
                const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
                const cpuPercent = systemDelta > 0 ? (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100 : 0;
                const ramUsage = stats.memory_stats.usage || 0;
                const ramLimit = stats.memory_stats.limit || 1;
                const ramPercent = ramLimit > 0 ? (ramUsage / ramLimit) * 100 : 0;
                const netIn = stats.networks?.eth0?.rx_bytes || 0;
                const netOut = stats.networks?.eth0?.tx_bytes || 0;
                insertContainerStats({
                    container_id: c.Id,
                    container_name: c.Names[0]?.replace(/^\//, ''),
                    cpu_percent: cpuPercent,
                    ram_percent: ramPercent,
                    ram_bytes: ramUsage,
                    net_in: netIn,
                    net_out: netOut
                });
                // Alert checks (rate-limited: once per 15 min per container/metric)
                if (cpuPercent > cpuThreshold) {
                    const recent = getRecentAlerts(c.Id, 'cpu', 15);
                    if (recent.length === 0) {
                        recordAlert(c.Id, 'cpu', cpuThreshold);
                        addNotification('warning', `CPU usage for ${c.Names[0]?.replace(/^\//, '')} is ${cpuPercent.toFixed(1)}% (threshold: ${cpuThreshold}%)`, c.Id);
                    }
                }
                if (ramPercent > ramThreshold) {
                    const recent = getRecentAlerts(c.Id, 'ram', 15);
                    if (recent.length === 0) {
                        recordAlert(c.Id, 'ram', ramThreshold);
                        addNotification('warning', `RAM usage for ${c.Names[0]?.replace(/^\//, '')} is ${ramPercent.toFixed(1)}% (threshold: ${ramThreshold}%)`, c.Id);
                    }
                }
            }
            catch (e) {
                // Skip containers we can't stat
            }
        }
    }
    catch (e) {
        console.error('stats collection failed:', e);
    }
}
// Watch docker events for container stops
export async function watchDockerEvents() {
    try {
        const stream = await docker.getEvents();
        stream.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(l => l.trim());
            for (const line of lines) {
                try {
                    const event = JSON.parse(line);
                    if (event.Type === 'container' && event.Action === 'die') {
                        const name = event.Actor?.Attributes?.name || 'unknown';
                        const exitCode = event.Actor?.Attributes?.exitCode;
                        if (exitCode && exitCode !== '0') {
                            addNotification('error', `Container ${name} stopped unexpectedly (exit code ${exitCode})`, event.Actor?.ID);
                        }
                    }
                }
                catch {
                    // ignore parse errors
                }
            }
        });
        stream.on('error', (err) => {
            console.error('docker events stream error:', err);
        });
    }
    catch (e) {
        console.error('failed to start docker events watcher:', e);
    }
}

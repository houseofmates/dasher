import { json } from '@sveltejs/kit';
import { checkDockerHealth, getHealthStatus } from '$lib/server/health';
import { getDockerInfo, getDockerVersion } from '$lib/server/docker';
import { getStatsDatabaseInfo } from '$lib/server/db';

export async function GET({ request }) {
  try {
    // Check basic health
    const dockerHealth = await checkDockerHealth();
    const healthStatus = getHealthStatus();
    
    // Get Docker system info
    let dockerInfo = null;
    let dockerVersion = null;
    
    if (dockerHealth.healthy) {
      try {
        [dockerInfo, dockerVersion] = await Promise.all([
          getDockerInfo(),
          getDockerVersion()
        ]);
      } catch (e) {
        console.warn('Failed to get Docker info:', e);
      }
    }
    
    // Get database info
    let dbInfo = null;
    try {
      dbInfo = getStatsDatabaseInfo();
    } catch (e) {
      console.warn('Failed to get database info:', e);
    }
    
    // Determine overall health
    const overallHealthy = dockerHealth.healthy && dbInfo !== null;
    
    // Response data
    const healthData = {
      status: overallHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '0.0.1',
      
      // Docker health
      docker: {
        healthy: dockerHealth.healthy,
        latency: dockerHealth.latency,
        error: dockerHealth.error,
        reconnecting: dockerHealth.reconnecting,
        circuitBreakerOpen: dockerHealth.circuitBreakerOpen,
        reconnectAttempts: healthStatus.reconnectAttempts,
        info: dockerInfo ? {
          containers: dockerInfo.Containers,
          containersRunning: dockerInfo.ContainersRunning,
          containersPaused: dockerInfo.ContainersPaused,
          containersStopped: dockerInfo.ContainersStopped,
          images: dockerInfo.Images,
          version: dockerVersion?.Version,
          apiVersion: dockerVersion?.ApiVersion,
          architecture: dockerInfo.Architecture,
          memoryTotal: dockerInfo.MemTotal,
          operatingSystem: dockerInfo.OperatingSystem
        } : null
      },
      
      // Database health
      database: {
        healthy: dbInfo !== null,
        size: dbInfo?.size || 0,
        statsRecords: (dbInfo as any)?.statsRecords || 0,
        lastOptimization: (dbInfo as any)?.lastOptimization || null
      },
      
      // System health
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
    
    // Return appropriate HTTP status
    const statusCode = overallHealthy ? 200 : 503;
    
    return json(healthData, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as any).message,
      uptime: process.uptime()
    }, { status: 503 });
  }
}
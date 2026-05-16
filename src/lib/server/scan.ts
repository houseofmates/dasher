import { exec } from 'child_process';
import { promisify } from 'util';
import { saveVulnerabilityScan, getLatestVulnerabilityScan, shouldScanImage } from './db';

const execAsync = promisify(exec);

export interface Vulnerability {
  VulnerabilityID: string;
  Severity: string;
  Title?: string;
  Description?: string;
  PkgName?: string;
  InstalledVersion?: string;
  FixedVersion?: string;
}

export interface ScanResult {
  image: string;
  scannedAt: string;
  vulns: Vulnerability[];
  summary: Record<string, number>;
  error?: string;
  cached?: boolean;
  scanDuration?: number;
  scanMethod?: string;
}

export async function scanImage(imageName: string, imageId?: string, forceRescan = false): Promise<ScanResult> {
  const startTime = Date.now();
  const result: ScanResult = {
    image: imageName,
    scannedAt: new Date().toISOString(),
    vulns: [],
    summary: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 }
  };

  // Use imageId for caching if provided, otherwise hash the image name
  const cacheKey = imageId || Buffer.from(imageName).toString('base64').replace(/[+/=]/g, '').substring(0, 16);
  
  // Check if we should skip scanning due to cache
  if (!forceRescan && !shouldScanImage(cacheKey)) {
    const cached = getLatestVulnerabilityScan(cacheKey);
    if (cached) {
      return {
        image: imageName,
        scannedAt: new Date(cached.scanned_at * 1000).toISOString(),
        vulns: cached.scan_data.vulns || [],
        summary: cached.summary,
        cached: true
      };
    }
  }

  let scanMethod = 'native';
  try {
    // Check if trivy is available
    await execAsync('which trivy');
  } catch {
    // Try docker-based trivy
    scanMethod = 'docker';
    try {
      await execAsync('docker pull aquasec/trivy:latest');
    } catch {
      // ignore pull errors
    }
  }

  try {
    let stdout: string;
    
    if (scanMethod === 'docker') {
      const { stdout: dockerOutput } = await execAsync(
        `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --format json --severity HIGH,CRITICAL,MEDIUM,LOW ${imageName}`,
        { timeout: 300000 }
      );
      stdout = dockerOutput;
    } else {
      const { stdout: nativeOutput } = await execAsync(
        `trivy image --format json --severity HIGH,CRITICAL,MEDIUM,LOW ${imageName}`,
        { timeout: 300000 }
      );
      stdout = nativeOutput;
    }
    
    const scanResult = parseTrivyOutput(stdout, imageName);
    const scanDuration = Date.now() - startTime;
    
    // Save to database
    saveVulnerabilityScan(cacheKey, imageName, scanResult, scanResult.summary, scanDuration, `trivy-${scanMethod}`);
    
    return {
      ...scanResult,
      scanDuration,
      scanMethod
    };
    
  } catch (e: any) {
    // trivy returns exit code 1 when vulns found, but still outputs JSON
    if (e.stdout) {
      const scanResult = parseTrivyOutput(e.stdout, imageName);
      const scanDuration = Date.now() - startTime;
      
      // Save to database even on "error" (vulns found)
      saveVulnerabilityScan(cacheKey, imageName, scanResult, scanResult.summary, scanDuration, `trivy-${scanMethod}`);
      
      return {
        ...scanResult,
        scanDuration,
        scanMethod
      };
    }
    
    result.error = e.stderr || e.message || 'trivy scan failed';
    result.scanDuration = Date.now() - startTime;
    result.scanMethod = scanMethod;
    
    return result;
  }
}

function parseTrivyOutput(stdout: string, imageName: string): ScanResult {
  const result: ScanResult = {
    image: imageName,
    scannedAt: new Date().toISOString(),
    vulns: [],
    summary: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 }
  };

  try {
    const data = JSON.parse(stdout);
    const results = data.Results || [];
    
    for (const r of results) {
      for (const v of (r.Vulnerabilities || [])) {
        result.vulns.push({
          VulnerabilityID: v.VulnerabilityID,
          Severity: v.Severity,
          Title: v.Title,
          Description: v.Description,
          PkgName: v.PkgName,
          InstalledVersion: v.InstalledVersion,
          FixedVersion: v.FixedVersion
        });
        const sev = v.Severity || 'UNKNOWN';
        result.summary[sev] = (result.summary[sev] || 0) + 1;
      }
    }
  } catch (e) {
    result.error = 'failed to parse scan results';
  }

  return result;
}

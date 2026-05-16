import { exec } from 'child_process';
import { promisify } from 'util';
import { parse as yamlParse } from 'yaml';

const execAsync = promisify(exec);

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ComposePreview {
  services: Record<string, any>;
  networks?: Record<string, any>;
  volumes?: Record<string, any>;
  version?: string;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export function validateYAML(content: string): { errors: ValidationError[], warnings: ValidationError[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  try {
    const lines = content.split('\n');
    
    // Basic YAML syntax validation
    try {
      yamlParse(content);
    } catch (yamlError: any) {
      if (yamlError.mark) {
        errors.push({
          line: yamlError.mark.line + 1,
          column: yamlError.mark.column + 1,
          message: yamlError.message,
          severity: 'error'
        });
      } else {
        errors.push({
          line: 1,
          column: 1,
          message: yamlError.message || 'Invalid YAML syntax',
          severity: 'error'
        });
      }
      return { errors, warnings };
    }
    
    // Docker Compose specific validation
    const parsed = yamlParse(content);
    
    if (!parsed || typeof parsed !== 'object') {
      errors.push({
        line: 1,
        column: 1,
        message: 'Invalid Docker Compose structure',
        severity: 'error'
      });
      return { errors, warnings };
    }
    
    
    // Validate services
    if (parsed.services) {
      Object.entries(parsed.services).forEach(([serviceName, service]: [string, any]) => {
        if (!service || typeof service !== 'object') {
          errors.push({
            line: findServiceLine(content, serviceName),
            column: 1,
            message: `Service '${serviceName}' must be an object`,
            severity: 'error'
          });
          return;
        }
        
        // Check for required image or build
        if (!service.image && !service.build) {
          errors.push({
            line: findServiceLine(content, serviceName),
            column: 1,
            message: `Service '${serviceName}' must have either 'image' or 'build'`,
            severity: 'error'
          });
        }
        
        // Check for port conflicts
        if (service.ports) {
          const ports = Array.isArray(service.ports) ? service.ports : [service.ports];
          ports.forEach((port: any, index: number) => {
            if (typeof port === 'string' && !port.includes(':')) {
              warnings.push({
                line: findServiceLine(content, serviceName),
                column: 1,
                message: `Service '${serviceName}' port ${port} should specify host port for better management`,
                severity: 'warning'
              });
            }
          });
        }
        
        // Check for missing restart policy
        if (!service.restart) {
          warnings.push({
            line: findServiceLine(content, serviceName),
            column: 1,
            message: `Service '${serviceName}' missing restart policy (recommended: 'unless-stopped')`,
            severity: 'warning'
          });
        }
        
        // Check for health check
        if (!service.healthcheck && service.image) {
          warnings.push({
            line: findServiceLine(content, serviceName),
            column: 1,
            message: `Service '${serviceName}' missing health check for better monitoring`,
            severity: 'warning'
          });
        }
      });
    }
    
    // Check for orphaned networks
    if (parsed.networks) {
      Object.entries(parsed.networks).forEach(([networkName, network]: [string, any]) => {
        if (network && typeof network === 'object' && !network.driver) {
          warnings.push({
            line: findNetworkLine(content, networkName),
            column: 1,
            message: `Network '${networkName}' missing driver (default: 'bridge')`,
            severity: 'warning'
          });
        }
      });
    }
    
    // Check for volume mounts
    if (parsed.services) {
      Object.entries(parsed.services).forEach(([serviceName, service]: [string, any]) => {
        if (service.volumes) {
          const volumes = Array.isArray(service.volumes) ? service.volumes : [service.volumes];
          volumes.forEach((volume: any) => {
            if (typeof volume === 'string' && volume.startsWith('./')) {
              warnings.push({
                line: findServiceLine(content, serviceName),
                column: 1,
                message: `Service '${serviceName}' using relative volume path - consider using named volumes`,
                severity: 'warning'
              });
            }
          });
        }
      });
    }
    
  } catch (error) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Unexpected validation error',
      severity: 'error'
    });
  }
  
  return { errors, warnings };
}

function findServiceLine(content: string, serviceName: string): number {
  const lines = content.split('\n');
  const servicePattern = new RegExp(`^\\s*${serviceName}:`, 'm');
  for (let i = 0; i < lines.length; i++) {
    if (servicePattern.test(lines[i])) {
      return i + 1;
    }
  }
  return 1;
}

function findNetworkLine(content: string, networkName: string): number {
  const lines = content.split('\n');
  const networkPattern = new RegExp(`^\\s*${networkName}:`, 'm');
  for (let i = 0; i < lines.length; i++) {
    if (networkPattern.test(lines[i])) {
      return i + 1;
    }
  }
  return 1;
}

export function parseComposePreview(content: string): ComposePreview {
  const { errors, warnings } = validateYAML(content);
  
  let parsed: any = {};
  try {
    parsed = yamlParse(content) || {};
  } catch {
    // Return empty structure if parsing fails
  }
  
  return {
    services: parsed.services || {},
    networks: parsed.networks || {},
    volumes: parsed.volumes || {},
    version: parsed.version,
    errors,
    warnings
  };
}

export async function getComposeServices(path: string): Promise<any[]> {
  try {
    const { stdout } = await execAsync(`docker compose -f ${path} config --services`);
    return stdout.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting compose services:', error);
    return [];
  }
}

export async function getComposeImages(path: string): Promise<string[]> {
  try {
    const { stdout } = await execAsync(`docker compose -f ${path} config --images`);
    return stdout.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

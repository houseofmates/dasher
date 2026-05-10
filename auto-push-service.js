#!/usr/bin/env node

import { watch } from 'fs';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_PATH = join(__dirname, 'auto-push-config.json');

// Default configuration
const DEFAULT_CONFIG = {
  watchPath: process.cwd(),
  excludePatterns: [
    'node_modules',
    '.git',
    'build',
    'dist',
    '.svelte-kit',
    'auto-push-*.js',
    'auto-push-*.json',
    '*.log'
  ],
  commitTimeout: 10000, // 10 seconds
  branch: 'main',
  commitMessage: 'Auto-update: {timestamp}',
  pushDelay: 2000, // 2 seconds after commit
  logFile: join(__dirname, 'auto-push.log'),
  maxLogSize: 1024 * 1024 // 1MB
};

let config;
let pendingChanges = new Map();
let timeouts = new Map();

// Load configuration
function loadConfig() {
  try {
    const configFile = readFileSync(CONFIG_PATH, 'utf8');
    config = { ...DEFAULT_CONFIG, ...JSON.parse(configFile) };
  } catch (error) {
    config = DEFAULT_CONFIG;
    saveConfig();
  }
}

// Save configuration
function saveConfig() {
  try {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    log('Error saving config:', error.message);
  }
}

// Logging function
function log(...args) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${args.join(' ')}\n`;
  
  try {
    writeFileSync(config.logFile, message, { flag: 'a' });
    
    // Rotate log if too large
    const stats = readFileSync(config.logFile, 'utf8');
    if (stats.length > config.maxLogSize) {
      const lines = stats.split('\n');
      const halfLines = Math.floor(lines.length / 2);
      writeFileSync(config.logFile, lines.slice(halfLines).join('\n'));
    }
  } catch (error) {
    console.error('Logging error:', error.message);
  }
  
  console.log(message.trim());
}

// Check if file should be excluded
function shouldExclude(filePath) {
  return config.excludePatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filePath);
  });
}

// Get relative path from watch directory
function getRelativePath(fullPath) {
  return fullPath.replace(config.watchPath + '/', '');
}

// Check if file has actually changed (content comparison)
function hasFileChanged(filePath) {
  try {
    const gitStatus = execSync(`git status --porcelain "${filePath}"`, { 
      encoding: 'utf8',
      cwd: config.watchPath 
    }).trim();
    
    return gitStatus !== '';
  } catch (error) {
    return false;
  }
}

// Schedule commit for changes
function scheduleCommit(filePath) {
  const relativePath = getRelativePath(filePath);
  
  // Clear existing timeout for this file
  if (timeouts.has(relativePath)) {
    clearTimeout(timeouts.get(relativePath));
  }
  
  // Set new timeout
  const timeoutId = setTimeout(() => {
    commitChanges(relativePath);
  }, config.commitTimeout);
  
  timeouts.set(relativePath, timeoutId);
  pendingChanges.set(relativePath, Date.now());
  
  log(`Change detected in ${relativePath}. Will commit in ${config.commitTimeout/1000}s if not reverted.`);
}

// Commit changes to git
function commitChanges(filePath) {
  try {
    // Check if changes still exist
    if (!hasFileChanged(filePath)) {
      log(`Changes to ${filePath} were reverted. Skipping commit.`);
      pendingChanges.delete(filePath);
      return;
    }
    
    // Stage the file
    execSync(`git add "${filePath}"`, { cwd: config.watchPath });
    
    // Create commit message
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const commitMsg = config.commitMessage.replace('{timestamp}', timestamp);
    
    // Commit the changes
    execSync(`git commit -m "${commitMsg}"`, { cwd: config.watchPath });
    
    log(`Committed changes to ${filePath}`);
    
    // Schedule push after delay
    setTimeout(() => {
      pushToGitHub();
    }, config.pushDelay);
    
    pendingChanges.delete(filePath);
    
  } catch (error) {
    log(`Error committing ${filePath}:`, error.message);
  }
}

// Push changes to GitHub
function pushToGitHub() {
  try {
    // Check if there are commits to push
    const status = execSync('git status --porcelain -b', { 
      encoding: 'utf8',
      cwd: config.watchPath 
    });
    
    if (status.includes('ahead')) {
      execSync(`git push origin ${config.branch}`, { cwd: config.watchPath });
      log(`Pushed changes to GitHub (${config.branch})`);
    } else {
      log('No new commits to push');
    }
    
  } catch (error) {
    log(`Error pushing to GitHub:`, error.message);
  }
}

// Initialize git repository if needed
function initGit() {
  try {
    // Check if we're in a git repository
    execSync('git rev-parse --git-dir', { cwd: config.watchPath, stdio: 'ignore' });
    log('Git repository detected');
  } catch (error) {
    log('Not a git repository. Initializing...');
    try {
      execSync('git init', { cwd: config.watchPath });
      execSync(`git branch -M ${config.branch}`, { cwd: config.watchPath });
      log('Git repository initialized');
    } catch (initError) {
      log('Error initializing git repository:', initError.message);
      process.exit(1);
    }
  }
  
  // Check if remote is configured
  try {
    execSync('git remote get-url origin', { cwd: config.watchPath, stdio: 'ignore' });
    log('GitHub remote detected');
  } catch (error) {
    log('No GitHub remote configured. Please add a remote with: git remote add origin <url>');
  }
}

// Watch for file changes
function startWatching() {
  log(`Starting file watcher in ${config.watchPath}`);
  log(`Excluding patterns: ${config.excludePatterns.join(', ')}`);
  log(`Commit timeout: ${config.commitTimeout/1000}s`);
  
  const watcher = watch(config.watchPath, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    const fullPath = join(config.watchPath, filename);
    
    // Skip excluded files
    if (shouldExclude(filename)) {
      return;
    }
    
    // Only handle change events
    if (eventType === 'change') {
      scheduleCommit(fullPath);
    }
  });
  
  // Handle watcher errors
  watcher.on('error', (error) => {
    log('Watcher error:', error.message);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log('Shutting down...');
    watcher.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Shutting down...');
    watcher.close();
    process.exit(0);
  });
}

// Main function
function main() {
  log('Auto-push service starting...');
  
  loadConfig();
  initGit();
  startWatching();
  
  log('Auto-push service is running. Press Ctrl+C to stop.');
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log('Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('Unhandled rejection at:', promise, 'reason:', reason);
});

// Start the service
main();
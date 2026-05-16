import { docker } from './docker';
import { addNotification } from './db';
let _isHealthy = true;
let _lastError = null;
let _lastCheck = Date.now();
let _reconnectAttempts = 0;
let _reconnectTimeout = null;
let _isReconnecting = false;
let _circuitBreakerOpen = false;
let _circuitBreakerTime = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 2000;
const MAX_RECONNECT_DELAY = 30000;
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
function calculateBackoff(attempt) {
    return Math.min(INITIAL_RECONNECT_DELAY * Math.pow(1.5, attempt), MAX_RECONNECT_DELAY);
}
async function attemptReconnection() {
    if (_isReconnecting || _circuitBreakerOpen)
        return;
    _isReconnecting = true;
    _reconnectAttempts++;
    try {
        console.log(`🔌 Docker reconnection attempt ${_reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
        // Check if Docker socket exists and is accessible
        const socketPath = process.env.DOCKER_SOCK_PATH || '/var/run/docker.sock';
        try {
            require('fs').accessSync(socketPath, require('fs').constants.R_OK | require('fs').constants.W_OK);
        }
        catch (socketError) {
            const errorMessage = socketError instanceof Error ? socketError.message : String(socketError);
            throw new Error(`Docker socket not accessible: ${errorMessage}`);
        }
        // Force recreate docker client with timeout
        const newDocker = new (require('dockerode').default)({
            socketPath,
            timeout: 5000
        });
        await Promise.race([
            newDocker.ping(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 10000))
        ]);
        // If successful, replace the global docker instance
        global.__docker = newDocker;
        _isHealthy = true;
        _lastError = null;
        _reconnectAttempts = 0;
        _isReconnecting = false;
        _circuitBreakerOpen = false;
        addNotification('success', 'Docker connection restored');
        console.log('✅ Docker connection restored');
    }
    catch (error) {
        _lastError = error.message || 'Docker reconnection failed';
        console.error(`❌ Docker reconnection failed: ${_lastError}`);
        if (_reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            _circuitBreakerOpen = true;
            _circuitBreakerTime = Date.now();
            addNotification('error', `Docker connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts - circuit breaker opened`);
            console.error(`💀 Docker reconnection abandoned after ${MAX_RECONNECT_ATTEMPTS} attempts - circuit breaker opened`);
            _isReconnecting = false;
            // Schedule circuit breaker reset
            setTimeout(() => {
                _circuitBreakerOpen = false;
                console.log('🔧 Circuit breaker reset - will attempt reconnection');
                if (!_isHealthy) {
                    _reconnectAttempts = 0;
                    attemptReconnection();
                }
            }, CIRCUIT_BREAKER_TIMEOUT);
        }
        else {
            const delay = calculateBackoff(_reconnectAttempts);
            _reconnectTimeout = setTimeout(attemptReconnection, delay);
        }
    }
}
export async function checkDockerHealth() {
    const start = Date.now();
    // Check if circuit breaker is open
    if (_circuitBreakerOpen) {
        const timeRemaining = Math.max(0, CIRCUIT_BREAKER_TIMEOUT - (Date.now() - _circuitBreakerTime));
        return {
            healthy: false,
            error: `Circuit breaker open - retrying in ${Math.ceil(timeRemaining / 1000)}s`,
            latency: Date.now() - start,
            reconnecting: false,
            circuitBreakerOpen: true
        };
    }
    try {
        // Use current docker instance or fallback
        const dockerInstance = global.__docker || docker;
        // Add timeout to ping
        await Promise.race([
            dockerInstance.ping(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Health check timeout')), 5000))
        ]);
        // If we were previously unhealthy, mark as recovered
        if (!_isHealthy) {
            _isHealthy = true;
            _lastError = null;
            _reconnectAttempts = 0;
            if (_reconnectTimeout) {
                clearTimeout(_reconnectTimeout);
                _reconnectTimeout = null;
            }
            addNotification('success', 'Docker connection restored');
        }
        _lastCheck = Date.now();
        return { healthy: true, latency: Date.now() - start };
    }
    catch (e) {
        const wasHealthy = _isHealthy;
        _isHealthy = false;
        _lastError = e.message || 'docker socket unreachable';
        _lastCheck = Date.now();
        // Start reconnection process if this is a new failure
        if (wasHealthy && !_isReconnecting) {
            addNotification('warning', 'Docker connection lost, attempting reconnection...');
            attemptReconnection();
        }
        return {
            healthy: false,
            error: _lastError || undefined,
            latency: Date.now() - start,
            reconnecting: _isReconnecting,
            circuitBreakerOpen: false
        };
    }
}
export function isDockerHealthy() {
    // If last check was > 30s ago, assume stale but don't block
    if (Date.now() - _lastCheck > 30000 && !_isHealthy)
        return false;
    return _isHealthy;
}
export function getLastHealthError() {
    return _lastError;
}
export function getLastHealthCheck() {
    return _lastCheck;
}
// Enhanced health monitoring with configurable interval
const HEALTH_CHECK_INTERVAL = parseInt(process.env.HEALTH_CHECK_INTERVAL || '10') * 1000;
setInterval(() => {
    checkDockerHealth().catch((error) => {
        console.error('Health check failed:', error.message);
    });
}, HEALTH_CHECK_INTERVAL);
// Export utility functions for external health monitoring
export function getHealthStatus() {
    return {
        healthy: _isHealthy,
        lastError: _lastError,
        lastCheck: _lastCheck,
        reconnecting: _isReconnecting,
        reconnectAttempts: _reconnectAttempts,
        circuitBreakerOpen: _circuitBreakerOpen,
        circuitBreakerTime: _circuitBreakerTime
    };
}
export function forceReconnection() {
    if (!_isReconnecting && !_circuitBreakerOpen) {
        _reconnectAttempts = 0;
        attemptReconnection();
    }
}

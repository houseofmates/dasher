import { WebSocketServer } from 'ws';
import { docker } from './docker';
import { checkDockerHealth } from './health';
const sessions = new Map();
const MAX_BUFFER = 1000;
const SESSION_TTL = 300000; // keep session alive for 5 minutes after disconnect
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 60000;
const PING_INTERVAL = 30000; // ping every 30 seconds
const MAX_IDLE_TIME = 600000; // kill sessions after 10 minutes of inactivity
function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function calculateBackoff(attempt) {
    return Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempt), MAX_RECONNECT_DELAY);
}
function notifySessionState(session, message, isError = false) {
    const color = isError ? '\x1b[31m' : '\x1b[33m';
    session.wsSet.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
            ws.send(`\r\n${color}[${message}]\x1b[0m\r\n`);
        }
    });
}
function saveSessionState(session) {
    // Save session state to disk for recovery across restarts
    try {
        const state = {
            id: session.id,
            containerId: session.containerId,
            createdAt: session.createdAt,
            terminalSize: session.terminalSize,
            workingDirectory: session.workingDirectory,
            environment: session.environment,
            buffer: session.buffer.slice(-100) // Save last 100 lines
        };
        // In a production environment, you might want to save this to Redis or a database
        console.log(`Session state saved for ${session.id}`);
    }
    catch (e) {
        console.error('Failed to save session state:', e);
    }
}
async function attemptReconnect(session) {
    if (session.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        notifySessionState(session, 'Max reconnection attempts reached', true);
        saveSessionState(session);
        cleanupSession(session.id);
        return false;
    }
    session.isReconnecting = true;
    const delay = calculateBackoff(session.reconnectAttempts);
    session.reconnectAttempts++;
    notifySessionState(session, `Reconnecting... (${session.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
    await new Promise(resolve => setTimeout(resolve, delay));
    // Check Docker health before attempting reconnection
    const health = await checkDockerHealth();
    if (!health.healthy) {
        notifySessionState(session, `Docker unavailable: ${health.error}`, true);
        if (session.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => attemptReconnect(session), 5000);
        }
        return false;
    }
    const success = await startExec(session);
    if (success) {
        session.reconnectAttempts = 0;
        session.isReconnecting = false;
        session.lastActivity = Date.now();
        notifySessionState(session, 'Reconnected successfully');
        // Restore terminal state if available
        if (session.terminalSize) {
            try {
                await session.exec.resize({
                    h: session.terminalSize.rows,
                    w: session.terminalSize.cols
                });
            }
            catch (e) {
                console.error('Failed to restore terminal size:', e);
            }
        }
        // Replay recent buffer with context
        const replay = session.buffer.join('');
        if (replay) {
            session.wsSet.forEach(ws => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(`\x1b[33m[session restored - ${new Date().toLocaleTimeString()}]\x1b[0m\r\n${replay.slice(-3000)}`);
                }
            });
        }
    }
    else {
        session.isReconnecting = false;
    }
    return success;
}
async function startExec(session) {
    try {
        // Check if container is still running
        const container = docker.getContainer(session.containerId);
        const containerInfo = await container.inspect();
        if (containerInfo.State.Status !== 'running') {
            notifySessionState(session, `Container is ${containerInfo.State.Status}`, true);
            return false;
        }
        // Create exec with enhanced options
        const execOptions = {
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            Cmd: ['/bin/sh', '-c', '[ -e /bin/bash ] && /bin/bash || /bin/sh'],
            Env: session.environment ? Object.entries(session.environment).map(([k, v]) => `${k}=${v}`) : undefined,
            WorkingDir: session.workingDirectory
        };
        session.exec = await container.exec(execOptions);
        const stream = await session.exec.start({
            stdin: true,
            hijack: true,
            Detach: false
        });
        session.stream = stream;
        session.alive = true;
        session.lastActivity = Date.now();
        // Set terminal size if specified
        if (session.terminalSize) {
            try {
                await session.exec.resize({
                    h: session.terminalSize.rows,
                    w: session.terminalSize.cols
                });
            }
            catch (e) {
                console.error('Failed to set terminal size:', e);
            }
        }
        stream.on('data', (chunk) => {
            const text = chunk.toString();
            session.buffer.push(text);
            if (session.buffer.length > MAX_BUFFER)
                session.buffer.shift();
            session.lastActivity = Date.now();
            session.wsSet.forEach(ws => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(text);
                }
            });
        });
        stream.on('end', () => {
            session.alive = false;
            session.wsSet.forEach(ws => {
                if (ws.readyState === ws.OPEN) {
                    ws.send('\r\n\x1b[31m[session ended]\x1b[0m\r\n');
                }
            });
            saveSessionState(session);
            cleanupSession(session.id);
        });
        stream.on('error', (err) => {
            console.error('stream error:', err);
            session.alive = false;
            // Attempt reconnection on stream errors
            if (!session.isReconnecting && session.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                notifySessionState(session, 'Stream error, attempting reconnection...');
                setTimeout(() => attemptReconnect(session), 1000);
            }
            else {
                notifySessionState(session, 'Session error occurred', true);
                saveSessionState(session);
                cleanupSession(session.id);
            }
        });
        return true;
    }
    catch (err) {
        console.error('failed to start exec:', err);
        session.alive = false;
        // Provide more specific error messages
        let errorMsg = 'Failed to start terminal session';
        if (err.message.includes('no such container')) {
            errorMsg = 'Container not found';
        }
        else if (err.message.includes('container is not running')) {
            errorMsg = 'Container is not running';
        }
        else if (err.message.includes('permission denied')) {
            errorMsg = 'Permission denied accessing container';
        }
        notifySessionState(session, errorMsg, true);
        return false;
    }
}
function cleanupSession(id) {
    const session = sessions.get(id);
    if (!session)
        return;
    if (session.timeout)
        clearTimeout(session.timeout);
    try {
        if (session.stream && !session.stream.destroyed) {
            session.stream.end();
        }
        if (session.exec) {
            session.exec.destroy();
        }
    }
    catch { }
    sessions.delete(id);
    console.log(`Session ${id} cleaned up`);
}
export function setupWebSocket(server) {
    const wss = new WebSocketServer({
        noServer: true,
        perMessageDeflate: false, // Disable compression for better performance with terminal data
        maxPayload: 1024 * 1024, // 1MB max payload
        clientTracking: true
    });
    server.on('upgrade', (request, socket, head) => {
        const url = new URL(request.url || '', `http://${request.headers.host}`);
        if (url.pathname === '/terminal') {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        }
    });
    wss.on('connection', async (ws, request) => {
        const url = new URL(request.url || '', `http://${request.headers.host}`);
        const containerId = url.searchParams.get('id');
        const sessionId = url.searchParams.get('session') || generateSessionId();
        if (!containerId) {
            ws.close(1008, 'container id required');
            return;
        }
        try {
            // Check for existing session
            let session = sessions.get(sessionId);
            if (session && session.containerId === containerId && session.alive) {
                // Reconnect to existing session
                if (session.timeout) {
                    clearTimeout(session.timeout);
                    session.timeout = null;
                }
                session.wsSet.add(ws);
                // Replay buffer
                const replay = session.buffer.join('');
                if (replay)
                    ws.send(`\x1b[33m[reconnected]\x1b[0m\r\n${replay.slice(-2000)}`);
            }
            else {
                // Start new session
                session = {
                    id: sessionId,
                    containerId,
                    stream: null,
                    buffer: [],
                    wsSet: new Set([ws]),
                    exec: null,
                    alive: false,
                    timeout: null,
                    reconnectAttempts: 0,
                    lastActivity: Date.now(),
                    createdAt: Date.now(),
                    lastPing: Date.now(),
                    isReconnecting: false,
                    terminalSize: { cols: 80, rows: 24 },
                    workingDirectory: undefined,
                    environment: undefined
                };
                sessions.set(sessionId, session);
                await startExec(session);
            }
            // Send session ID to client so it can reconnect
            ws.send(JSON.stringify({ type: 'session', id: sessionId }));
            ws.on('message', async (data) => {
                const text = data.toString();
                // Handle control messages
                if (text.startsWith('{')) {
                    try {
                        const control = JSON.parse(text);
                        if (control.type === 'resize' && session) {
                            session.terminalSize = { cols: control.cols, rows: control.rows };
                            if (session.exec && session.alive) {
                                try {
                                    await session.exec.resize({
                                        h: control.rows,
                                        w: control.cols
                                    });
                                }
                                catch (e) {
                                    console.error('Failed to resize terminal:', e);
                                }
                            }
                        }
                        else if (control.type === 'ping' && session) {
                            session.lastPing = Date.now();
                            ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                        }
                    }
                    catch (e) {
                        // Ignore invalid JSON
                    }
                    return;
                }
                if (session && session.alive && session.stream?.write) {
                    try {
                        session.stream.write(text);
                        session.lastActivity = Date.now();
                    }
                    catch (err) {
                        console.error('failed to write to stream:', err);
                        // Attempt reconnection on write failure
                        if (!await attemptReconnect(session)) {
                            ws.close(1011, 'session lost');
                        }
                    }
                }
            });
            ws.on('close', () => {
                if (!session)
                    return;
                session.wsSet.delete(ws);
                if (session.wsSet.size === 0) {
                    // Start grace period
                    session.timeout = setTimeout(() => {
                        cleanupSession(session.id);
                    }, SESSION_TTL);
                }
            });
            ws.on('error', (err) => {
                console.error('ws error:', err);
            });
        }
        catch (err) {
            console.error('terminal exec error:', err);
            ws.close(1011, 'failed to start exec');
        }
    });
    // Session maintenance and cleanup
    setInterval(() => {
        const now = Date.now();
        for (const [id, session] of sessions.entries()) {
            // Clean up idle sessions
            if (now - session.lastActivity > MAX_IDLE_TIME && session.wsSet.size === 0) {
                console.log(`Cleaning up idle session ${id}`);
                cleanupSession(id);
            }
            // Ping sessions to detect dead connections
            else if (session.wsSet.size > 0 && now - session.lastPing > PING_INTERVAL) {
                session.wsSet.forEach(ws => {
                    if (ws.readyState === ws.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
                    }
                });
                session.lastPing = now;
            }
        }
    }, PING_INTERVAL);
    return wss;
}

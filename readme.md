# dasher - zero-maintenance portainer alternative

a self-healing docker management interface designed for single-user homelabs. built with sveltekit and node.js, featuring ai-assisted compose fixing, real-time monitoring, and automatic recovery.

## features

### ultra-reliable auto-recovery
- **systemd service**: auto-starts on boot and restarts on crash
- **health monitoring**: continuous docker socket health checks with exponential backoff
- **circuit breaker**: prevents cascade failures with automatic recovery
- **graceful shutdown**: clean resource cleanup on service termination

### complete docker management
- **container lifecycle**: start, stop, restart, rename, and monitor containers
- **image management**: pull, tag, remove, and vulnerability scan images
- **network management**: create, inspect, and delete docker networks
- **volume management**: create, backup, and manage named volumes
- **compose integration**: edit, validate, and run docker compose stacks

### advanced monitoring & analytics
- **real-time stats**: cpu, ram, and network usage with historical data
- **persistent storage**: sqlite database survives restarts and crashes
- **resource alerts**: configurable thresholds for cpu and memory usage
- **container events**: automatic notifications for unexpected stops

### security & scanning
- **vulnerability scanning**: integrated trivy scanning for image security
- **scan history**: cached results with timestamp tracking
- **security notifications**: alerts for high-severity vulnerabilities

### beautiful ui/ux
- **dark theme**: consistent dark mode optimized for long sessions
- **mobile responsive**: works perfectly on phones for quick checks
- **micro-interactions**: smooth animations and loading states
- **real-time preview**: live compose file validation and preview

### ai-powered features
- **compose assistant**: ai-powered yaml fixing and optimization
- **error detection**: automatic identification of common docker issues
- **smart suggestions**: context-aware recommendations

### backup & restore
- **one-click backup**: export all compose files and volumes
- **automated backups**: scheduled backup creation
- **easy restore**: simple restore dialog with progress tracking

## quick start

### prerequisites
- docker engine installed and running
- node.js 18+ (auto-installed by setup script)
- linux system with systemd
- root/sudo access for installation

### one-command installation

```bash
# clone the repository
git clone https://github.com/yourusername/dasher.git
cd dasher

# run the setup script
sudo ./setup.sh
```

the setup script will:
- install node.js 18+ if not present
- install all dependencies
- build the sveltekit application
- configure systemd service
- set up firewall rules
- start the service

### access your dashboard

after installation, the dashboard will be available at:
- **web interface**: http://localhost:6967
- **service status**: `sudo systemctl status dasher`

## management commands

### service management
```bash
# start the service
sudo systemctl start dasher

# stop the service
sudo systemctl stop dasher

# restart the service
sudo systemctl restart dasher

# check service status
sudo systemctl status dasher

# view live logs
sudo journalctl -u dasher -f
```

### admin recovery
```bash
# reset all settings to defaults
/opt/dasher/reset-admin.js --reset-admin

# this will reset:
# - alert thresholds (cpu/ram to 90%)
# - theme to dark mode
# - clear all notifications
# - reset ai configuration
```

## architecture

### backend (node.js)
- **docker integration**: dockerode for docker api access
- **database**: sqlite with wal mode for performance
- **websocket**: xterm.js for terminal sessions
- **health checks**: custom monitoring with circuit breaker

### frontend (sveltekit)
- **ui framework**: svelte 5 with sveltekit
- **styling**: tailwind css with custom dark theme
- **charts**: uplot for lightweight data visualization
- **editor**: codemirror with yaml syntax highlighting

### key components
- **health monitor**: continuous docker socket monitoring
- **stats collector**: resource usage tracking with persistence
- **notification system**: browser and in-app notifications
- **backup engine**: automated compose and volume backups

## configuration

### environment variables
```bash
# service configuration
port=6967                          # web server port
host=0.0.0.0                       # bind address
node_env=production                # environment mode

# docker configuration
docker_sock_path=/var/run/docker.sock  # docker socket path
health_check_interval=10               # health check interval (seconds)

# database configuration
db_path=/opt/dasher/data/dasher.db  # sqlite database path
```

### user settings (in-app)
- **alert thresholds**: cpu and ram usage alerts
- **theme**: dark/light mode selection
- **auto refresh**: dashboard refresh interval
- **notifications**: browser notification preferences

## monitoring & health

### health endpoint
```bash
curl http://localhost:6967/api/health
```

response includes:
- docker connection status and latency
- database health and size
- system resource usage
- service uptime

### metrics collection
- **interval**: every 30 seconds (configurable)
- **retention**: 7 days (configurable)
- **optimization**: daily database optimization

### alert types
- **container stops**: unexpected container termination
- **resource usage**: cpu/ram threshold exceeded
- **docker health**: socket connection issues
- **vulnerabilities**: high-severity security issues

## security considerations

### production deployment
- **systemd hardening**: nonewprivileges, privatetmp enabled
- **file permissions**: restricted access to docker socket
- **network security**: local-only access by default
- **resource limits**: configurable memory and cpu limits

### data protection
- **sqlite database**: encrypted at rest (optional)
- **api keys**: stored securely in database
- **session management**: secure websocket connections
- **input validation**: comprehensive input sanitization

## development

### local development
```bash
# install dependencies
npm install

# start development server
npm run dev

# build for production
npm run build

# start production server
npm run start
```

### project structure
```
src/
├── lib/
│   ├── server/          # backend logic
│   │   ├── docker.ts    # docker api wrapper
│   │   ├── health.ts    # health monitoring
│   │   ├── monitor.ts   # stats collection
│   │   ├── backup.ts    # backup/restore
│   │   └── scan.ts      # vulnerability scanning
│   └── components/      # svelte components
├── routes/              # sveltekit pages
│   ├── api/            # api endpoints
│   ├── containers/     # container management
│   ├── images/         # image management
│   ├── networks/       # network management
│   ├── volumes/        # volume management
│   └── compose/        # compose editor
└── routes/+layout.svelte  # main layout
```

### api endpoints
- `get /api/health` - service health status
- `get /api/containers` - list containers
- `get /api/images` - list images
- `get /api/networks` - list networks
- `get /api/volumes` - list volumes
- `post /api/backup` - create backup
- `post /api/compose/validate` - validate compose file

## troubleshooting

### common issues

#### service won't start
```bash
# check service status
sudo systemctl status dasher

# view error logs
sudo journalctl -u dasher -n 50

# check docker socket
sudo ls -la /var/run/docker.sock

# check permissions
sudo chown root:docker /var/run/docker.sock
```

#### can't access web interface
```bash
# check if service is running
sudo systemctl status dasher

# check port availability
sudo netstat -tlnp | grep 6967

# check firewall
sudo ufw status
```

#### database issues
```bash
# check database file
ls -la /opt/dasher/data/dasher.db

# reset database (warning: loses data)
sudo systemctl stop dasher
sudo rm /opt/dasher/data/dasher.db
sudo systemctl start dasher
```

## contributing

### development setup
```bash
# clone repository
git clone https://github.com/yourusername/dasher.git
cd dasher

# install dependencies
npm install

# start development
npm run dev
```

### code style
- uses prettier for formatting
- eslint for linting
- typescript for type safety
- tailwind css for styling

### testing
```bash
# run type checking
npm run check

# run linting
npm run lint

# format code
npm run format
```

## license

mit license - see license file for details.

## support

- **issues**: report bugs on github
- **features**: request features via github issues
- **documentation**: see wiki for detailed guides

## acknowledgments

- **docker**: for containerization technology
- **svelte**: for the reactive ui framework
- **node.js**: for the runtime environment
- **tailwind css**: for the utility-first css framework
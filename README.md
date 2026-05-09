# Docker Management Dashboard

A modern web-based dashboard for managing Docker containers, stacks, and networks with a clean SvelteKit interface.

![Dashboard Preview](https://via.placeholder.com/600x300?text=Dashboard+Preview)

## Features

- **Container Management**: View, start, stop, and restart containers
- **Stack Discovery**: Automatically find docker-compose stacks in your system
- **Terminal Access**: Web-based terminal for container shell access
- **Network Management**: View and manage Docker networks
- **System Analytics**: Monitor container resource usage
- **WebSocket Terminal**: Persistent terminal sessions via WebSocket

## Screenshots

![Containers View](https://via.placeholder.com/600x400?text=Containers+View)
![Terminal View](https://via.placeholder.com/600x400?text=Terminal+View)

## Installation

### Prerequisites

- Node.js 18+ (or use Node.js version from `.nvmrc`)
- Docker daemon running
- For development: SvelteKit CLI

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/docker.git
cd docker

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local to match your system configuration

# Development server
npm run dev

# Production build
npm run build
npm run preview
```

## Environment Variables

Create a `.env.local` file in the project root with your configuration:

```env
# Docker socket path (default: /var/run/docker.sock)
DOCKER_SOCK_PATH=/var/run/docker.sock

# Main Docker compose stack path (optional)
MAIN_STACK_PATH=/path/to/your/main/docker-compose.yml

# Cloudflare Tunnel configuration
CLOUDFLARE_CONFIG_PATH=/etc/cloudflared/config.yml
CLOUDFLARE_ACCESS_LOG_PATH=/var/log/cloudflared/access.log

# Application settings
PORT=6967
HOST=0.0.0.0

# NVIDIA API keys for YAML fixes (optional)
# NVIDIA_API_KEY_1=
# NVIDIA_API_KEY_2=
# ...
```

## Development

### Prerequisites

- Node.js 18.x or later
- Docker
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Copy environment example: `cp .env.example .env.local`
4. Configure your paths in `.env.local`
5. Start the development server: `npm run dev`

The application will be available at `http://localhost:5173` (or the port specified in your `.env.local`).

### Project Structure

```
src/
├── lib/
│   ├── server/     # Server-side utilities
│   ├── toasts.ts   # Notification system
│   └── snippets.ts # Reusable code snippets
├── routes/         # SvelteKit routes
│   ├── containers/
│   ├── images/
│   ├── networks/
│   ├── terminal/
│   └── api/
└── lib/           # Shared components
```

## Building for Production

```bash
# Create production build
npm run build

# Preview the build
npm run preview

# Start production server
npm run start
```

## Docker Deployment

The application can be containerized using Docker:

```dockerfile
# Dockerfile (example)
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.svelte-kit/output/server/ ./
COPY --from=builder /app/package.json .
COPY --from=builder /app/src/ ./
COPY --from=builder /app/static/ ./static/
RUN npm install --production

EXPOSE 6967
CMD npm run start
```

## API Usage

The dashboard provides a WebSocket API for terminal access and HTTP API for container management.

### WebSocket Terminal

Connect to `/terminal?id=CONTAINER_ID` for WebSocket terminal access.

### REST API

The application uses standard SvelteKit load functions and endpoints.

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Security Considerations

- The dashboard should be accessed via HTTPS in production
- Consider adding authentication for public-facing deployments
- Keep your NVIDIA API keys secure
- Regularly update dependencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Open a pull request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Keep the UI consistent
- Document your changes

## License

[MIT License](LICENSE) - Feel free to use and modify as needed.

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/docker/issues) page.

## Acknowledgments

- [SvelteKit](https://svelte.dev) - Web framework
- [Dockerode](https://www.npmjs.com/package/dockerode) - Docker API client
- [Phosphor Icons](https://phosphor-icons.com) - Icon set
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## Disclaimer

This dashboard is provided as-is. Use at your own risk. Always test in a safe environment before deploying to production systems.
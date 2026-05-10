# docker

a modern web interface for managing docker containers, images, volumes, and networks.

## what this is

this is a sleek, dark-themed docker management dashboard built with sveltekit. it gives you a clean, intuitive way to interact with your docker environment without touching the command line. think of it as a visual companion to your docker workflow.

## what you can do

- **dashboard** - get a quick overview of your docker ecosystem with real-time stats
- **containers** - view, start, stop, restart, and manage your containers
- **images** - browse, pull, and manage docker images
- **volumes** - manage persistent data storage
- **networks** - configure and monitor docker networks
- **compose** - work with docker-compose files visually
- **terminal** - access container terminals directly from your browser
- **analytics** - monitor resource usage and performance

## tech stack

- **frontend**: sveltekit + svelte 5
- **styling**: tailwindcss with a dark theme
- **icons**: phosphor icons
- **docker integration**: dockerode
- **terminal**: xterm.js
- **code editor**: codemirror (for yaml editing)
- **charts**: uplot for analytics
- **mobile**: capacitor for native app support

## getting started

### prerequisites

- node.js 18+ 
- docker running on your system
- access to docker socket (`/var/run/docker.sock`)

### installation

```bash
# clone the repo
git clone <your-repo-url>
cd docker

# install dependencies
npm install

# copy environment variables
cp .env.example .env

# start development server
npm run dev
```

### building for production

```bash
# build the application
npm run build

# preview the build
npm run preview
```

### docker deployment

```bash
# build the docker image
docker build -t docker-dashboard .

# run the container
docker run -d \
  --name docker-dashboard \
  -p 5173:5173 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker-dashboard
```

## configuration

the app uses environment variables for configuration. check `.env.example` for available options:

- `docker_sock_path` - path to docker socket (default: `/var/run/docker.sock`)
- `port` - application port (default: `5173`)

## development

### project structure

```
src/
├── lib/
│   ├── components/     # reusable svelte components
│   └── server/        # server-side utilities
├── routes/            # sveltekit pages and api routes
└── app.html          # main html template
```

### available scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run check` - type checking
- `npm run lint` - lint code
- `npm run format` - format code

## features in detail

### real-time updates
the app uses websockets to provide real-time updates about container status, logs, and system events.

### terminal access
integrated terminal lets you access running containers directly from your browser with full terminal emulation.

### compose support
visual editor for docker-compose files with syntax highlighting and validation.

### mobile app
the app includes capacitor configuration, allowing it to be packaged as a native mobile app for android and ios.

## contributing

1. fork the repository
2. create a feature branch
3. make your changes
4. ensure the code follows the project style (lowercase, human-friendly)
5. submit a pull request

## license

mates license

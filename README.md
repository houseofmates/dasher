<h1 align="center">dasher</h1> 
a modern web interface for managing docker containers, images, volumes, and networks.

<h2 align="center">what this is</h2> 

this is a sleek, dark-themed docker management dashboard built with sveltekit. it gives you a clean, intuitive way to interact with your docker environment without touching the command line. think of it as a visual companion to your docker workflow.

<h2 align="center">what you can do</h2> 

- **dashboard** - get a quick overview of your docker ecosystem with real-time stats
- **containers** - view, start, stop, restart, and manage your containers
- **images** - browse, pull, and manage docker images
- **volumes** - manage persistent data storage
- **networks** - configure and monitor docker networks
- **compose** - work with docker-compose files visually
- **terminal** - access container terminals directly from your browser
- **analytics** - monitor resource usage and performance

<h2 align="center">tech stach</h2> 

- **frontend**: sveltekit + svelte 5
- **styling**: tailwindcss with a dark theme
- **icons**: phosphor icons
- **docker integration**: dockerode
- **terminal**: xterm.js
- **code editor**: codemirror (for yaml editing)
- **charts**: uplot for analytics
- **mobile**: capacitor for native app support

<h2 align="center">getting started</h2> 

<h3 align="center">prerequisites</h3> 

- node.js 18+ 
- docker running on your system
- access to docker socket (`/var/run/docker.sock`)

<h3 align="center">building for production</h3> 

```bash
# build the application
npm run build

# preview the build
npm run preview
```

<h3 align="center">docker deployment</h3> 

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

<h2 align="center">configuration</h2> 

the app uses environment variables for configuration. check `.env.example` for available options:

- `docker_sock_path` - path to docker socket (default: `/var/run/docker.sock`)
- `port` - application port (default: `5173`)

<h2 align="center">development</h2> 

<h3align="center">project structure</h3> 

```
src/
├── lib/
│   ├── components/     # reusable svelte components
│   └── server/        # server-side utilities
├── routes/            # sveltekit pages and api routes
└── app.html          # main html template
```

<h3 align="center">available scripts</h3> 

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run check` - type checking
- `npm run lint` - lint code
- `npm run format` - format code

<h2 align="center">features</h2> 

<h3align="center">real-time updates</h3> 
the app uses websockets to provide real-time updates about container status, logs, and system events.

<h3 align="center">terminal access</h3> 
integrated terminal lets you access running containers directly from your browser with full terminal emulation.

<h3align="compose support">e</h3> 
visual editor for docker-compose files with syntax highlighting and validation.

<h3align="center">mobile app</h3> 
the app includes capacitor configuration, allowing it to be packaged as a native mobile app for android.

<h2align="center">contributing</h2> 
1. fork the repository
2. create a feature branch
3. make your changes
4. ensure the code follows the project style (lowercase, human-friendly)
5. submit a pull request

<h2align="center">license</h2> 

mates license

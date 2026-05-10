# docker management dashboard

hey! so this is a web-based dashboard i've been working on to manage docker containers, stacks, and networks. it's built with sveltekit and has a pretty clean interface for keeping track of all your docker stuff.

## what can it do?

- **see all your containers** - start, stop, restart, view logs
- **find docker-compose stacks** - automatically discovers stacks in your system
- **web-based terminal** - access container shells through your browser
- **network management** - view and manage docker networks
- **analytics** - basic monitoring of container resource usage

## screenshots (just imagine them)

you know the drill - containers view, terminal view, all that good stuff. it's pretty neat.

## installation

### what you'll need

- node.js 18+ (check the `.nvmrc` for the version i use)
- docker running somewhere
- npm or yarn

### quick start

```bash
# clone it down
git clone https://github.com/yourusername/docker.git
cd docker

# install dependencies
npm install

# copy the example env file
cp .env.example .env.local

# edit it to match your setup (paths to docker socket, compose files, etc.)
nvim .env.local

# run the dev server
npm run dev
```

it'll be running at whatever port you set in your `.env.local` (default is 6967).

## environment variables

here's what you can configure:

```env
# docker socket path - default is /var/run/docker.sock
DOCKER_SOCK_PATH=/var/run/docker.sock

# main docker-compose stack - where your main compose file lives
MAIN_STACK_PATH=

# cloudflare tunnel stuff - if you're using cloudflare
CLOUDFLARE_CONFIG_PATH=/etc/cloudflared/config.yml
CLOUDFLARE_ACCESS_LOG_PATH=/var/log/cloudflared/access.log

# app settings
PORT=6967
HOST=0.0.0.0

# nvidia api keys (for fixing yaml) - get these from nvidia developer portal
# NVIDIA_API_KEY_1=
# NVIDIA_API_KEY_2=
# ...
```

just put these in your `.env.local` file. the `.env.example` has placeholders.

## project structure

- `src/routes/` - all the pages (containers, images, networks, terminal, etc.)
- `src/lib/server/` - backend utils, docker stuff, compose handling
- `src/lib/` - shared components and utils
- `static/` - static assets

it's a pretty standard sveltekit project.

## development

i use nvm to manage node versions - check `.nvmrc` for the version i'm on. other than that, just:

```bash
npm install
npm run dev
```

hot reloading works great for svelte stuff.

## building for production

```bash
npm run build
npm run preview  # check it out locally
npm run start    # actually start the production server
```

## docker deployment

yeah, you can dockerize this too. here's a sample dockerfile:

```dockerfile
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

## contributing

feel like helping out? cool.

1. fork the repo
2. make a branch
3. do your thing
4. open a pr

just keep the code style consistent and write tests if you're adding features.

## license

mit. do what you want with it.

## support

open an issue on github if you run into problems. i'll try to help out when i can.

## disclaimer

this is a personal project, not enterprise software. use at your own risk. make sure you test it in a safe environment before putting it anywhere near production systems.
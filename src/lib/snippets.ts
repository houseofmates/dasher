export const snippets = [
  {
    name: 'nginx service',
    description: 'basic nginx web server',
    content: `  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    restart: always`
  },
  {
    name: 'redis service',
    description: 'redis in-memory data store',
    content: `  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: always`
  },
  {
    name: 'postgres service',
    description: 'postgresql database with volume',
    content: `  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: always

volumes:
  db_data:`
  },
  {
    name: 'mariadb service',
    description: 'mariadb database',
    content: `  mariadb:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - db_data:/var/lib/mysql
    restart: always

volumes:
  db_data:`
  },
  {
    name: 'nvidia gpu runtime',
    description: 'service with gpu access',
    content: `  gpu-app:
    image: my-gpu-app:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]`
  }
];


export const snippets = [
  {
    name: 'Nginx Service',
    description: 'Basic Nginx web server',
    content: `  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    restart: always`
  },
  {
    name: 'Redis Service',
    description: 'Redis in-memory data store',
    content: `  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: always`
  },
  {
    name: 'Postgres Service',
    description: 'PostgreSQL database with volume',
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
    name: 'MariaDB Service',
    description: 'MariaDB database',
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
    name: 'Nvidia GPU Runtime',
    description: 'Service with GPU access',
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

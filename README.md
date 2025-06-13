# Chat App API

This project is a chat API developed with Node.js, Express and TypeScript.

## Prerequisites

- Node.js v22.13.1 or higher
- pnpm v10.3.0 or higher
- Docker and Docker Compose (Optional)

## Environment setup

1. Clone the repository
```bash
  git clone https://github.com/joequich/chatty-backend.git your-directory
```

2. Configure environment variables:
   - For Docker Compose: create or edit the `docker.env` to set up the initial PostgreSQL database (used only by Docker Compose).
      
    Example `docker.env`:
   ```env
    POSTGRES_PASSWORD=yourdbpassword
    POSTGRES_USER=admin
    POSTGRES_DB=yourdbname
   ```
   - For the backend: create or edit the `.env` file with the following variables:
     - `API_VERSION`
     - `PORT`
     - `DATABASE_URL`
     - `JWT_ACCESS_SECRET_KEY`
     - `JWT_ACCESS_EXPIRATION_TIME` (in milliseconds)
     - `JWT_REFRESH_SECRET_KEY`
     - `JWT_REFRESH_EXPIRATION_TIME` (in milliseconds)

    Example `.env`:
   ```env
   API_VERSION=0.1.0
   PORT=3000
   DATABASE_URL=postgres://admin:yourdbpassword@localhost:5432/yourdbname
   JWT_ACCESS_SECRET_KEY=yourkey
   JWT_ACCESS_EXPIRATION_TIME=
   JWT_REFRESH_SECRET_KEY=yourkey
   JWT_REFRESH_EXPIRATION_TIME=
   ```

## Installing dependencies

```bash
pnpm install
```

## Running locally with Docker Compose

This will bring up the PostgreSQL database and backend in development mode:

````bash
docker compose up
````

The API will be available at [http://localhost:3000](http://localhost:3000).

## Running locally without Docker Compose

If you already have a local PostgreSQL instance running and the environment variables set in your .env file, you can run the backend directly:



1. Make sure your PostgreSQL database is running and accessible with the credentials in your `.env` file.
2. Install dependencies (if you haven't already):
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

The API will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev`: Run the server in development mode with automatic reload.
- `pnpm build`: Compile the project to JavaScript in the `dist` folder.
- `pnpm start`: Runs the compiled server.
- `pnpm check`: Linting and code check with Biome.
- `pnpm format`: Format the code with Biome.

## Notes

- The backend depends on the PostgreSQL database defined in `compose.yaml`.
- You can specify the environment file when starting the server using the `--env` flag. For example: 
    - `pnpm dev -- --env production` will use `.env.production`.

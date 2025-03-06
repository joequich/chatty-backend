# Stage 0: Base stage
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@10.3.0
WORKDIR /app
COPY . .

# Stage 1: Install development dependencies
FROM base AS dev-deps
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM dev-deps AS build
RUN pnpm run build

# Stage 3: Install production dependencies
FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

# Stage 4: Final stage
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

EXPOSE 3000
CMD ["pnpm", "start"]

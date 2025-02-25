FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm@10.3

RUN pnpm install --frozen-lockfile

USER node

EXPOSE 3000

CMD ["pnpm", "dev"]

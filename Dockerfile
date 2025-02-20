FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm@10.3

RUN pnpm install --frozen-lockfile

RUN pnpm run build

USER node

EXPOSE 3000

CMD ["pnpm", "start", "--env", "production"]

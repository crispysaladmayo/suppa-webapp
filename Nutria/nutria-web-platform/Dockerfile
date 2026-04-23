# Hono + Postgres — deploy on Railway, Render, Fly.io, or any host that runs containers.
# Set root directory to this folder (nutria-web-platform) in your platform.

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Monorepo lockfile; both workspaces are required for npm to resolve the tree.
COPY package.json package-lock.json ./
COPY app/server/package.json ./app/server/
COPY app/web/package.json ./app/web/

RUN npm ci

COPY app/server ./app/server
RUN npm run build -w @nutria/server
RUN npm prune --omit=dev

COPY scripts/docker-entrypoint.sh ./scripts/
RUN chmod +x ./scripts/docker-entrypoint.sh

EXPOSE 3001
ENV NODE_ENV=production
CMD ["./scripts/docker-entrypoint.sh"]

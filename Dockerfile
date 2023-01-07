FROM node:16-alpine AS installer
WORKDIR /app
RUN npm i -g pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --prod

#################################

FROM installer AS builder
RUN pnpm install --frozen-lockfile --prefer-offline
COPY . .
RUN pnpm build

#################################

FROM node:16-alpine AS runner
WORKDIR /app

COPY --from=builder /app/svelte.config.js ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["node", "build/index.js"]

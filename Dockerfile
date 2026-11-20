FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock prisma.config.ts vite.config.ts tsr.config.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"
RUN bunx prisma generate
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]

# -----------------------------
# Base image
# -----------------------------
FROM node:20-alpine AS base
RUN corepack enable

# -----------------------------
# Dependencies stage
# -----------------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# -----------------------------
# Build stage
# -----------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 1. Generate Prisma Client (with dummy env var)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# 2. Build the Next.js app (THIS WAS MISSING)
RUN pnpm build

# -----------------------------
# Production runner
# -----------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
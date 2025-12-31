# =============================
# Base
# =============================
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# Disable telemetry everywhere
ENV NEXT_TELEMETRY_DISABLED=1

# =============================
# Dependencies
# =============================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# =============================
# Builder (runs ONLY in GitHub Actions)
# =============================
FROM base AS builder

# Prevent OOM during build
ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma client generation (no DB needed)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    npx prisma generate

# Next.js standalone build
RUN pnpm build

# =============================
# Runner (VERY SMALL + LOW RAM)
# =============================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Runtime memory cap (safe for 1GB droplet)
ENV NODE_OPTIONS="--max-old-space-size=512"

# Copy ONLY the required output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]

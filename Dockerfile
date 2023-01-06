# Adapted from https://github.com/vercel/next.js/blob/08c9530241e1c9245a5db861e504c8ed71b93abb/examples/with-docker/Dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/db
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "run", "dev"]

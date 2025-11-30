FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY .npmrc package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and source code
COPY prisma ./prisma
COPY src ./src
COPY schema ./schema

# Generate Prisma Client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy prod dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built code + prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Run setup + start
CMD ["sh", "-c", "npm run setup && npm run start:prod"]
# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# reduce telemetry noise during build
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./

# install all dependencies (dev + prod)
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner

WORKDIR /app

# runtime environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# create non-root user for safety
RUN useradd --user-group --create-home --shell /bin/false nextjs

# copy only package files and install production dependencies (keeps runtime slim)
COPY package.json package-lock.json ./

# copy built app and static assets from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R nextjs:nextjs /app
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
CMD ["npm", "start"]

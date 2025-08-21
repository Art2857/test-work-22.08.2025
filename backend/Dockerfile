FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS deps

RUN npm ci --only=production && npm cache clean --force

FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S express -u 1001

WORKDIR /app

RUN apk add --no-cache dumb-init curl

COPY --from=deps --chown=express:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=express:nodejs /app/dist ./dist
COPY --from=builder --chown=express:nodejs /app/package*.json ./

USER express

EXPOSE 3001

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
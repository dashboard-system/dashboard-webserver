FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build

FROM node:18-alpine AS production

RUN apk update && apk upgrade && apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S dashboard -u 1001

WORKDIR /app
COPY --chown=dashboard:nodejs package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=dashboard:nodejs /app/dist ./dist

RUN mkdir -p /app/db /app/logs && chown -R dashboard:nodejs /app

USER dashboard
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]

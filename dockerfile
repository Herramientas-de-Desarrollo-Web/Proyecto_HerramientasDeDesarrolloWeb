# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# copy package files first to use cache
COPY package*.json ./
RUN npm ci --only=production

# copy source
COPY . .

# If you have build step (e.g. frontend build), run it here:
# RUN npm run build

# final image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app /app

# change ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
# change to your start command (npm start or node index.js)
CMD ["node", "server.js"]

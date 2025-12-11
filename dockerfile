# ========== BASE STAGE ==========
FROM node:18-alpine AS base
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

# ========== FINAL STAGE ==========
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Crear usuario no root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar node_modules y código desde base
COPY --from=base /app /app

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]

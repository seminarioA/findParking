# Dockerfile para frontend FindParking (React + Vite + Tailwind CSS)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependencias
RUN npm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Producción: servidor estático con nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Limpiar archivos por defecto de nginx
RUN rm -rf ./*

# Copiar archivos built desde el stage builder
COPY --from=builder /app/dist .

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
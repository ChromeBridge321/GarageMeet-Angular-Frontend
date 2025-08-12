# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS build

# Variables de entorno para el build
ARG API_URL=https://api.garagemeet.site/api
ARG DOMAIN_URL=https://api.garagemeet.site
ARG STRIPE_KEY=pk_test_51RqxPyPlCUIY9G9QSqCypLJICRQgY5k6iP1WD5Po8X4OYgsMwfif8wL5rcW76pubYFx630gNtlW686pqB8yK2wYj00TxtibWDq

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Node.js
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production --silent

# Copiar código fuente
COPY . .

# Actualizar environment.prod.ts con variables de entorno
RUN sed -i "s|apiUrl: .*|apiUrl: '${API_URL}',|g" src/eviroments/environment.prod.ts && \
    sed -i "s|domainUrl: .*|domainUrl: '${DOMAIN_URL}',|g" src/eviroments/environment.prod.ts && \
    sed -i "s|stripePublishableKey: .*|stripePublishableKey: '${STRIPE_KEY}'|g" src/eviroments/environment.prod.ts

# Build de la aplicación Angular para producción
RUN npm run build:prod

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine AS production

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos build de Angular desde la etapa anterior
COPY --from=build /app/dist/garage-meet /usr/share/nginx/html

# Crear archivo de configuración específico para Angular (SPA)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Configuración para Angular routing (SPA) \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # API proxy (opcional, para evitar CORS) \
    location /api/ { \
        proxy_pass ${API_URL}/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_cache_bypass $http_upgrade; \
    } \
    \
    # Cache para assets estáticos \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    \
    # Gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

# Crear script de inicio que sustituye variables de entorno en runtime
RUN echo '#!/bin/sh\n\
# Sustituir variables de entorno en archivos JavaScript\n\
if [ ! -z "$API_URL" ]; then\n\
    find /usr/share/nginx/html -name "*.js" -exec sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" {} +\n\
fi\n\
\n\
# Iniciar Nginx\n\
exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

# Exponer puerto 80
EXPOSE 80

# Usar script de inicio personalizado
ENTRYPOINT ["/docker-entrypoint.sh"]

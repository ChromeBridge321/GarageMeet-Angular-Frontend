# Etapa 1: Build de la aplicación Angular
FROM node:18-alpine AS build

# Variables de entorno para el build
ARG API_URL=https://api.garagemeet.site/api
ARG DOMAIN_URL=https://api.garagemeet.site
ARG STRIPE_KEY=pk_test_51RqxPyPlCUIY9G9QSqCypLJICRQgY5k6iP1WD5Po8X4OYgsMwfif8wL5rcW76pubYFx630gNtlW686pqB8yK2wYj00TxtibWDq

# Instalar dependencias del sistema necesarias para Angular
RUN apk add --no-cache git python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Node.js
COPY package*.json ./

# Instalar Angular CLI globalmente primero
RUN npm install -g @angular/cli@latest

# Instalar todas las dependencias del proyecto
RUN npm install

# Copiar código fuente
COPY . .

# Verificar que Angular CLI funciona
RUN ng version

# Actualizar environment.prod.ts con variables de entorno si existe
RUN if [ -f "src/eviroments/environment.prod.ts" ]; then \
        sed -i "s|apiUrl: .*|apiUrl: '${API_URL}',|g" src/eviroments/environment.prod.ts && \
        sed -i "s|domainUrl: .*|domainUrl: '${DOMAIN_URL}',|g" src/eviroments/environment.prod.ts && \
        sed -i "s|stripePublishableKey: .*|stripePublishableKey: '${STRIPE_KEY}'|g" src/eviroments/environment.prod.ts && \
        echo "Environment updated:" && cat src/eviroments/environment.prod.ts; \
    fi

# Build de la aplicación Angular para producción usando ng directamente
RUN ng build --configuration production

# Verificar que el build se generó correctamente
RUN ls -la dist/garage-meet/

# Etapa 2: Servidor web con Nginx
FROM nginx:alpine AS production

# Copiar los archivos build de Angular desde la etapa anterior
COPY --from=build /app/dist/garage-meet /usr/share/nginx/html

# Crear configuración de Nginx para Angular SPA
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

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

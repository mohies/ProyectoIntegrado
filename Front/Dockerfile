# Etapa 1: Construcción de la aplicación Angular usando Node.js
FROM node:20-alpine AS builder
# Establecemos el directorio de trabajo dentro del contenedor

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli && npm install

# Compilamos la aplicación Angular en modo desarrollo (puedes cambiar a producción si lo prefieres)
#RUN ng build --configuration=production || (echo "❌ Build failed" && exit 1)
RUN ng build --configuration=development || (echo "❌ Build failed" && exit 1)

RUN echo "✅ Build success" && ls -la /app/dist && ls -la /app/dist/front-app


# Etapa 2: Servir la aplicación Angular compilada usando Nginx
FROM nginx:alpine
# Copiamos los archivos estáticos generados por Angular al directorio de Nginx
# Copiamos la configuración personalizada de Nginx
COPY --from=builder /app/dist/front-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

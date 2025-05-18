FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli && npm install

# 🛠 Añadimos salida y detención para debug
#RUN ng build --configuration=production || (echo "❌ Build failed" && exit 1)
RUN ng build --configuration=development || (echo "❌ Build failed" && exit 1)

RUN echo "✅ Build success" && ls -la /app/dist && ls -la /app/dist/front-app

FROM nginx:alpine

COPY --from=builder /app/dist/front-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

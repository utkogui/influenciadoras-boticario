# --- Estágio 1: Construir o Backend ---
FROM node:18-slim AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/. .
# Gera o cliente Prisma com o target correto para o deploy
RUN npx prisma generate

# Constrói o TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Construir o Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
# A URL da API será vazia, pois o frontend fará requisições relativas
RUN VITE_API_URL= npm run build

# --- Estágio Final: A Imagem de Produção ---
FROM node:18-slim
WORKDIR /app

# Instala Nginx e Supervisor
RUN apt-get update && apt-get install -y nginx supervisor

# Copia os arquivos construídos do backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copia os arquivos construídos do frontend para a pasta do Nginx
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copia os arquivos de configuração que vamos criar
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY nginx-fly.conf /etc/nginx/sites-available/default

# Expõe a porta que o Nginx irá escutar
EXPOSE 8080

# O Supervisor irá iniciar o Nginx e o Node
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 
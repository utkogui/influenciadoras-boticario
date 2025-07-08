# 1. Base Image
FROM node:18-slim AS base

# 2. Setup Environment
WORKDIR /usr/src/app

# 3. Install Dependencies
COPY package*.json ./
RUN npm install

# 4. Copy Prisma Schema
COPY prisma ./prisma
RUN npx prisma generate

# 5. Copy Application Code
COPY . .

# 6. Build the application
RUN npm run build

# --- Production Image ---
FROM node:18-slim AS production

# Install openssl for Prisma runtime
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/prisma ./prisma

EXPOSE 3001

# The command is specified in the docker-compose.yml to also run migrations
# CMD [ "npm", "run", "start" ] 
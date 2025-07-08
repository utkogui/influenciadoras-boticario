#!/bin/bash

echo "🚀 Iniciando build no Railway..."

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
npm run build

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd ../frontend
npm install
npm run build

echo "✅ Build concluído!" 
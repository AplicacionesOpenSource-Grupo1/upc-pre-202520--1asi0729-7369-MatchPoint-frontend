#!/bin/bash

# Script para deployment completo en Firebase
# Incluye frontend y API

echo "Iniciando deployment de PlayMatch..."

# 1. Generar variables de entorno para producción
echo "Generando configuración de producción..."
NODE_ENV=production node scripts/load-env.js

# 2. Build del frontend
echo "Building frontend..."
npm run build:prod

# 3. Instalar dependencias de Firebase Functions
echo "Instalando dependencias de Firebase Functions..."
cd functions
npm install
cd ..

# 4. Deploy a Firebase
echo "Desplegando a Firebase..."
firebase deploy

echo "Deployment completado!"
echo "Aplicación está disponible en: https://matchpoint-front.web.app/"
echo "API disponible en: https://matchpoint-front.web.app/api"

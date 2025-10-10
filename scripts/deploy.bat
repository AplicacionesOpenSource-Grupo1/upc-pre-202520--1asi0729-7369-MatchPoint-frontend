@echo off
REM Script para deployment completo en Firebase
REM Incluye frontend y API

echo Iniciando deployment de PlayMatch...

REM 1. Generar variables de entorno para producción
echo Generando configuración de producción...
set NODE_ENV=production
node scripts/load-env.js

REM 2. Build del frontend
echo Building frontend...
call npm run build:prod

REM 3. Instalar dependencias de Firebase Functions
echo Instalando dependencias de Firebase Functions...
cd functions
call npm install
cd ..

REM 4. Deploy a Firebase
echo Desplegando a Firebase...
call firebase deploy

echo Deployment completado!
echo Tu aplicación está disponible en: https://matchpoint-front.web.app
echo API disponible en: https://matchpoint-front.web.app/api

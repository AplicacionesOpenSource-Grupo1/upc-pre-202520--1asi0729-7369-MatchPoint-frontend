#!/usr/bin/env node

/**
 * Script para configurar el puerto de la fake API
 * Uso: node scripts/set-api-port.js [puerto]
 * Ejemplo: node scripts/set-api-port.js 3000
 */

const fs = require('fs');
const path = require('path');

// Obtener el puerto de los argumentos de línea de comandos
const args = process.argv.slice(2);
const newPort = args[0];

if (!newPort) {
  console.error('Error: Debes especificar un puerto');
  console.log('Uso: node scripts/set-api-port.js [puerto]');
  console.log('Ejemplo: node scripts/set-api-port.js 3000');
  process.exit(1);
}

// Validar que el puerto sea un número válido
const portNumber = parseInt(newPort, 10);
if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
  console.error('Error: El puerto debe ser un número entre 1 y 65535');
  process.exit(1);
}

// Rutas de los archivos .env
const envPath = path.resolve(__dirname, '..', '.env');
const envProductionPath = path.resolve(__dirname, '..', '.env.production');

/**
 * Actualiza el puerto en un archivo .env
 */
function updatePortInFile(filePath, port, isProduction = false) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Archivo ${path.basename(filePath)} no encontrado, se omitirá`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Actualizar API_PORT
    const portRegex = /^API_PORT=.*/m;
    if (portRegex.test(content)) {
      content = content.replace(portRegex, `API_PORT=${port}`);
    } else {
      // Si no existe, añadirlo después de la configuración de API
      const apiConfigRegex = /(# API Configuration[\s\S]*?)(\n# |$)/;
      if (apiConfigRegex.test(content)) {
        content = content.replace(apiConfigRegex, `$1API_PORT=${port}\n$2`);
      } else {
        content += `\nAPI_PORT=${port}\n`;
      }
    }

    // Actualizar API_BASE_URL solo en desarrollo
    if (!isProduction) {
      const baseUrlRegex = /^API_BASE_URL=.*/m;
      const newBaseUrl = `API_BASE_URL=http://localhost:${port}`;
      if (baseUrlRegex.test(content)) {
        content = content.replace(baseUrlRegex, newBaseUrl);
      } else {
        content += `\n${newBaseUrl}\n`;
      }
    }

    fs.writeFileSync(filePath, content);
    console.log(` ${path.basename(filePath)} actualizado con puerto ${port}`);
    return true;
  } catch (error) {
    console.error(`Error actualizando ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

console.log(`Configurando puerto de la fake API a: ${portNumber}`);
console.log('─'.repeat(50));

// Actualizar archivos .env
const devUpdated = updatePortInFile(envPath, portNumber, false);
const prodUpdated = updatePortInFile(envProductionPath, portNumber, true);

if (devUpdated || prodUpdated) {
  console.log('─'.repeat(50));
  console.log('Configuración actualizada exitosamente');
  console.log(`Ahora puedes usar: npm run api (puerto ${portNumber})`);
  console.log(`O ejecutar directamente: json-server --watch server/db.json --port ${portNumber}`);
  
  // Mostrar comandos útiles
  console.log('\nComandos disponibles:');
  console.log(`   - npm run api          - Ejecutar fake API en puerto ${portNumber}`);
  console.log(`   - npm run dev          - Ejecutar API y Angular juntos`);
  console.log(`   - npm start            - Solo Angular (puerto 4200)`);
} else {
  console.log('No se pudo actualizar ningún archivo de configuración');
  process.exit(1);
}

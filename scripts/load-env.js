const fs = require('fs');
const path = require('path');

// Determinar el entorno
const environment = process.env['NODE_ENV'] || 'development';
const isProduction = environment === 'production';

// Cargar el archivo .env apropiado
const envFile = isProduction ? '.env.production' : '.env';
const envPath = path.resolve(__dirname, '..', envFile);

console.log(`Loading environment variables from: ${envFile}`);

// Leer variables de entorno del archivo
const envConfig = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envConfig[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} else {
  console.warn(`Environment file ${envFile} not found!`);
}

// Si estamos en production y no se especificó API_BASE_URL, usar la ruta relativa
// para que Firebase Hosting pueda manejar los rewrites hacia /api/* (fake API)
if (isProduction) {
  const apiBase = envConfig['API_BASE_URL'];
  if (typeof apiBase === 'undefined' || apiBase === null || String(apiBase).trim() === '') {
    envConfig['API_BASE_URL'] = '/api';
    console.log('No API_BASE_URL found for production, defaulting to /api for Firebase rewrites');
  }
}

// Generar el contenido del script que se insertará en index.html
const envScript = `
  <script>
    window.env = window.env || {};
    ${Object.entries(envConfig).map(([key, value]) => 
      `window.env['${key}'] = '${value}';`
    ).join('\n    ')}
  </script>
`;

// Escribir el script en un archivo temporal
const outputPath = path.resolve(__dirname, '..', 'src', 'assets', 'env-config.js');
const jsContent = `
(function(window) {
  window.env = window.env || {};
  ${Object.entries(envConfig).map(([key, value]) => 
    `window.env['${key}'] = '${value}';`
  ).join('\n  ')}
})(this);
`;

// Crear el directorio si no existe
const assetsDir = path.dirname(outputPath);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(outputPath, jsContent);
console.log(`Environment configuration written to: ${outputPath}`);

const htmlScriptPath = path.resolve(__dirname, '..', 'env-script.html');
fs.writeFileSync(htmlScriptPath, envScript);
console.log(`HTML script written to: ${htmlScriptPath}`);

// Also write to public/assets so the dev server (which serves `public`) exposes the file
const publicAssetsDir = path.resolve(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}
const publicOutputPath = path.resolve(publicAssetsDir, 'env-config.js');
fs.writeFileSync(publicOutputPath, jsContent);
console.log(`Environment configuration also written to: ${publicOutputPath}`);

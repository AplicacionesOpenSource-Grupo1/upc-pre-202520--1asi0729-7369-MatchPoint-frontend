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
  console.warn(`Environment file ${envFile} not found! Using process.env only.`);
}

// Merge process.env: permitir que variables de entorno del entorno de CI/CD (ej. Vercel)
// sobrescriban las del archivo .env. Solo tomar claves relevantes para evitar
// volcar todo el environment sin intención.
const allowedKeys = [
  'NODE_ENV',
  'API_BASE_URL',
  'API_PORT',
  'API_TIMEOUT',
  'APP_NAME',
  'APP_VERSION'
];
allowedKeys.forEach(k => {
  if (process.env[k]) {
    envConfig[k] = process.env[k];
  }
});

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

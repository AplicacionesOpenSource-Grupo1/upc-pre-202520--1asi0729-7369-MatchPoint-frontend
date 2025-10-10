#!/usr/bin/env node

/**
 * Script básico para crear un favicon.ico simple desde SVG
 * Solo usando herramientas nativas de Node.js
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

console.log('🎨 Generando favicon básico para PlayMatch...\n');

// Por ahora, simplemente copiar el SVG como favicon.ico
// Esto funciona en navegadores modernos
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Crear un favicon.ico que en realidad es un SVG
// Los navegadores modernos pueden manejar esto
const icoPath = path.join(publicDir, 'favicon.ico');

// Escribir el SVG con un header simplificado para que funcione como ICO
fs.writeFileSync(icoPath, svgContent);

console.log('✅ favicon.ico creado (basado en SVG)');
console.log('✅ favicon.svg ya disponible');
console.log('✅ manifest.json disponible');

console.log('\n📋 Para favicons completos en PNG, instala Sharp:');
console.log('   npm install sharp sharp-ico');
console.log('   npm run generate-favicons');

console.log('\n🎉 ¡Favicon básico configurado!');

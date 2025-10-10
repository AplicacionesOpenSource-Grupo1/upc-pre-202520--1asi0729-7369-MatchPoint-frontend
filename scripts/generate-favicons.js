#!/usr/bin/env node

/**
 * Script para generar favicons en diferentes tamaños desde el SVG
 * Usa Sharp (librería de Node.js) para convertir SVG a PNG/ICO
 * 
 * Para usar este script:
 * 1. npm install sharp sharp-ico
 * 2. node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Verificar si Sharp está disponible
let sharp;
try {
  sharp = require('sharp');
  console.log('📦 Sharp detectado - Se generarán favicons PNG/ICO');
} catch (e) {
  console.log('⚠️  Sharp no instalado - Solo se generará favicon SVG');
  console.log('💡 Para generar todos los formatos, ejecuta: npm install sharp sharp-ico');
}

const publicDir = path.resolve(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

// Verificar que existe el SVG fuente
if (!fs.existsSync(svgPath)) {
  console.error('❌ No se encontró favicon.svg en public/');
  process.exit(1);
}

console.log('🎨 Generando favicons para PlayMatch...\n');

// Tamaños de favicon a generar
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
  { size: 192, name: 'android-chrome-192x192.png' }, // Android
  { size: 512, name: 'android-chrome-512x512.png' }  // Android
];

async function generateFavicons() {
  if (!sharp) {
    console.log('✅ favicon.svg ya está disponible');
    return;
  }

  try {
    // Leer el SVG
    const svgBuffer = fs.readFileSync(svgPath);
    
    console.log('🔄 Generando favicons PNG...');
    
    // Generar cada tamaño
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
        
      console.log(`  ✅ ${name} (${size}x${size})`);
    }

    // Generar favicon.ico (múltiples tamaños en un archivo)
    console.log('\n🔄 Generando favicon.ico...');
    
    // Crear buffers para diferentes tamaños del ICO
    const icoSizes = [16, 32, 48];
    const icoBuffers = [];
    
    for (const size of icoSizes) {
      const buffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
      icoBuffers.push(buffer);
    }

    // Intentar generar ICO si la librería está disponible
    try {
      const sharp_ico = require('sharp-ico');
      const icoBuffer = sharp_ico.encode(icoBuffers);
      fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
      console.log('  ✅ favicon.ico (16x16, 32x32, 48x48)');
    } catch (e) {
      console.log('  ⚠️  No se pudo generar favicon.ico (instala sharp-ico)');
    }

    console.log('\n📱 Generando iconos para PWA...');
    
    // Generar manifest.json básico
    const manifest = {
      name: "PlayMatch",
      short_name: "PlayMatch", 
      description: "Plataforma para reservar canchas y entrenadores deportivos",
      theme_color: "#10b981",
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png", 
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml"
        }
      ]
    };
    
    fs.writeFileSync(
      path.join(publicDir, 'manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );
    console.log('  ✅ manifest.json');

    console.log('\n🎉 ¡Favicons generados exitosamente!');
    console.log('\n📋 Archivos creados:');
    console.log('  • favicon.svg (vectorial)');
    console.log('  • favicon.ico (clásico)'); 
    console.log('  • favicon-*.png (varios tamaños)');
    console.log('  • apple-touch-icon.png (iOS)');
    console.log('  • android-chrome-*.png (Android)');
    console.log('  • manifest.json (PWA)');
    
  } catch (error) {
    console.error('❌ Error generando favicons:', error.message);
    process.exit(1);
  }
}

// Ejecutar la generación
generateFavicons();

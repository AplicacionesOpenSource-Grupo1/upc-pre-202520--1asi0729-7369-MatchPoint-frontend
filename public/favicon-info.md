# Favicon Setup - PlayMatch

Este directorio contiene los archivos de favicon para PlayMatch.

## Archivos actuales:
- ✅ `favicon.svg` - Favicon vectorial (funciona en navegadores modernos)
- ✅ `favicon.ico` - Favicon clásico (compatible con navegadores antiguos)
- ✅ `manifest.json` - Configuración para PWA

## Para generar todos los tamaños:

1. Instalar dependencias opcionales:
```bash
npm install sharp sharp-ico
```

2. Generar favicons completos:
```bash
npm run generate-favicons
```

Esto creará:
- favicon-16x16.png
- favicon-32x32.png  
- favicon-48x48.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- Y más tamaños

## Logo SVG usado:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="#10b981"/>
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.59L6.41 13l1.41-1.41L11 14.17l4.59-4.58L17 11l-6 6.59z" fill="white"/>
</svg>
```

## Colores:
- Primary: #10b981 (Verde esmeralda)
- Secondary: #059669 (Verde oscuro)
- Background: #ffffff (Blanco)

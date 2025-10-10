// Script para aplicar SEO a todos los componentes existentes
const fs = require('fs');
const path = require('path');

const componentsToUpdate = [
  {
    file: 'src/shared/presentation/views/register/register.ts',
    seoConfig: 'register'
  },
  {
    file: 'src/shared/presentation/views/court-search/court-search.ts',
    seoConfig: 'courts'
  },
  {
    file: 'src/shared/presentation/views/coach-search/coach-search.ts',
    seoConfig: 'coaches'
  },
  {
    file: 'src/shared/presentation/views/settings/settings.ts',
    seoConfig: 'settings'
  }
];

function addSeoToComponent(filePath, seoConfig) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has SeoService
  if (content.includes('SeoService')) {
    console.log(`${filePath} already has SEO`);
    return;
  }

  // Add import
  if (!content.includes('OnInit')) {
    content = content.replace(
      /import { Component,([^}]+)} from '@angular\/core';/,
      "import { Component,$1, OnInit } from '@angular/core';"
    );
  }

  // Add SeoService import
  const importLine = "import { SeoService } from '../../../infrastructure/services/seo.service';";
  if (!content.includes(importLine)) {
    const lastImportIndex = content.lastIndexOf("import");
    const nextLineIndex = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, nextLineIndex + 1) + importLine + '\n' + content.slice(nextLineIndex + 1);
  }

  // Add OnInit to class declaration
  content = content.replace(
    /export class (\w+) {/,
    'export class $1 implements OnInit {'
  );

  // Add SeoService injection
  const injectPattern = /private (\w+) = inject\((\w+)\);/g;
  let lastInjectMatch;
  let match;
  while ((match = injectPattern.exec(content)) !== null) {
    lastInjectMatch = match;
  }

  if (lastInjectMatch) {
    const injectIndex = content.indexOf(lastInjectMatch[0]) + lastInjectMatch[0].length;
    const seoInject = `\n  private seoService = inject(SeoService);`;
    content = content.slice(0, injectIndex) + seoInject + content.slice(injectIndex);
  }

  // Add ngOnInit method
  const constructorIndex = content.indexOf('constructor(');
  if (constructorIndex > -1) {
    const constructorEndIndex = content.indexOf('\n  }', constructorIndex) + 4;
    const ngOnInitMethod = `\n\n  ngOnInit(): void {\n    this.seoService.updateSeoTags(SeoService.SEO_CONFIG.${seoConfig});\n  }`;
    content = content.slice(0, constructorEndIndex) + ngOnInitMethod + content.slice(constructorEndIndex);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated SEO for: ${filePath}`);
}

// Apply to all components
componentsToUpdate.forEach(({ file, seoConfig }) => {
  addSeoToComponent(file, seoConfig);
});

console.log('SEO update complete!');

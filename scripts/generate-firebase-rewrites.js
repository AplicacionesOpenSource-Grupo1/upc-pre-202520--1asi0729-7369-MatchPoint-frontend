#!/usr/bin/env node

/**
 * Script to automatically generate Firebase hosting rewrites
 * for the static API based on available JSON files
 */
const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'public', 'api');
const FIREBASE_CONFIG_PATH = path.join(__dirname, '..', 'firebase.json');

function generateRewrites() {
  console.log('🔧 Generating Firebase hosting rewrites...');
  
  // Read existing firebase.json
  const firebaseConfig = JSON.parse(fs.readFileSync(FIREBASE_CONFIG_PATH, 'utf8'));
  
  // Get all API files
  const apiFiles = fs.readdirSync(API_DIR);
  
  // Generate rewrites
  const rewrites = [];
  
  // Collect all base endpoints and individual IDs
  const endpoints = {};
  
  apiFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const match = file.match(/^(.+?)(?:-(\d+))?\.json$/);
      if (match) {
        const [, base, id] = match;
        if (!endpoints[base]) {
          endpoints[base] = [];
        }
        if (id) {
          endpoints[base].push(id);
        }
      }
    }
  });
  
  // Generate rewrites for each endpoint
  Object.keys(endpoints).forEach(base => {
    // Base endpoint (list all)
    rewrites.push({
      source: `/api/${base}`,
      destination: `/api/${base}.json`
    });
    
    // Individual IDs
    endpoints[base].forEach(id => {
      rewrites.push({
        source: `/api/${base}/${id}`,
        destination: `/api/${base}-${id}.json`
      });
    });
  });
  
  // Add catch-all route for Angular routing
  rewrites.push({
    source: "**",
    destination: "/index.html"
  });
  
  // Update firebase config
  firebaseConfig.hosting.rewrites = rewrites;
  
  // Write back to firebase.json
  fs.writeFileSync(FIREBASE_CONFIG_PATH, JSON.stringify(firebaseConfig, null, 2));
  
  console.log(`Generated ${rewrites.length - 1} API rewrites + 1 catch-all route`);
  console.log('Updated firebase.json');
}

generateRewrites();

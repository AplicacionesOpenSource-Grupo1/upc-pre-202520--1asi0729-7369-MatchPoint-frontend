#!/usr/bin/env node

/**
 * Simple prebuild script for CI/CD environments
 * This script only does the essential tasks needed for building
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`${description} completed`);
  } catch (error) {
    console.error(`Error: ${description} failed:`, error.message);
    process.exit(1);
  }
}

function ensureFileExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating missing file: ${filePath}`);
    fs.writeFileSync(filePath, content);
  }
}

function main() {
  console.log('Starting CI prebuild process...\n');
  
  // Ensure .env file exists for CI
  const envPath = path.join(__dirname, '..', '.env');
  ensureFileExists(envPath, 'API_BASE_URL=https://matchpoint-front.web.app/api\n');
  
  // Load environment variables
  runCommand('node scripts/load-env.js', 'Loading environment variables');
  
  // Generate static API files
  runCommand('node scripts/generate-static-api.js', 'Generating static API files');
  
  console.log('\nCI prebuild process completed successfully!');
}

main();

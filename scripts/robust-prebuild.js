#!/usr/bin/env node

/**
 * Robust build script that works both locally and in CI/CD
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runScript(scriptPath, description) {
  try {
    if (fs.existsSync(scriptPath)) {
      console.log(`${description}...`);
      execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      console.log(`${description} completed`);
    } else {
      console.log(`${description} script not found at ${scriptPath}, skipping...`);
    }
  } catch (error) {
    console.error(`Error running ${description}:`, error.message);
  }
}

function main() {
  console.log('Starting robust prebuild process...\n');

  const scriptsDir = path.join(__dirname, '.');
  
  // Load environment variables
  runScript(path.join(scriptsDir, 'load-env.js'), 'Loading environment variables');
  
  // Generate static API files
  runScript(path.join(scriptsDir, 'generate-static-api.js'), 'Generating static API files');
  
  runScript(path.join(scriptsDir, 'generate-firebase-rewrites.js'), 'Generating Firebase rewrites');
  
  console.log('\nPrebuild process completed successfully!');
}

main();

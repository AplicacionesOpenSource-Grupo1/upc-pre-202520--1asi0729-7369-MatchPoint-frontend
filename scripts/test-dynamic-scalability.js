#!/usr/bin/env node

/**
 * Script to test the dynamic scalability of the API
 */
const https = require('https');

const BASE_URL = 'https://matchpoint-front.web.app/api';

function testDynamicCourt() {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/courts/99`;
    console.log(`Testing dynamic court: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200 && data.startsWith('{')) {
            const parsed = JSON.parse(data);
            console.log(`Dynamic Court Found! - ID: ${parsed.id}, Name: ${parsed.name}`);
            console.log(`Location: ${parsed.location}`);
            console.log(`Price: S/ ${parsed.price}`);
            console.log(`Rating: ${parsed.rating}/5`);
            resolve(parsed);
          } else {
            console.log(`Dynamic Court - Status: ${res.statusCode} - Response: ${data.substring(0, 100)}...`);
            reject({ status: res.statusCode, response: data.substring(0, 200) });
          }
        } catch (error) {
          console.log(`Dynamic Court - Parse Error: ${error.message}`);
          reject({ error: error.message, response: data.substring(0, 200) });
        }
      });
    }).on('error', (error) => {
      console.log(`Dynamic Court - Network error: ${error.message}`);
      reject({ error: error.message });
    });
  });
}

async function testDynamicScalability() {
  console.log('Testing Dynamic API Scalability...\n');

  try {
    const court = await testDynamicCourt();
  } catch (error) {
    console.error('\nFAILED: Dynamic scalability test failed:', error);
    process.exit(1);
  }
}

testDynamicScalability();

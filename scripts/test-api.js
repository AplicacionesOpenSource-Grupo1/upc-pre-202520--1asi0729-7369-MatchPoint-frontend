#!/usr/bin/env node

/**
 * Script to test API endpoints in production
 */
const https = require('https');

const BASE_URL = 'https://matchpoint-front.web.app/api';

const testEndpoints = [
  '/courts',
  '/courts/4',
  '/coaches',
  '/coaches/1',
];

function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`${endpoint} - Status: ${res.statusCode} - Data received`);
          resolve({ endpoint, status: res.statusCode, data: parsed });
        } catch (error) {
          console.log(`${endpoint} - Status: ${res.statusCode} - Invalid JSON`);
          reject({ endpoint, status: res.statusCode, error: error.message });
        }
      });
    }).on('error', (error) => {
      console.log(`${endpoint} - Network error: ${error.message}`);
      reject({ endpoint, error: error.message });
    });
  });
}

async function runTests() {
  console.log('🚀 Testing API endpoints...\n');
  
  for (const endpoint of testEndpoints) {
    try {
      await testEndpoint(endpoint);
      console.log('');
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error);
      console.log('');
    }
  }
  
  console.log('Test completed!');
}

runTests();

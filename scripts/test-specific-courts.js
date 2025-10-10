#!/usr/bin/env node

/**
 * Script to test specific court ID endpoints
 */
const https = require('https');

const BASE_URL = 'https://matchpoint-front.web.app/api';

function testCourtEndpoint(id) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/courts/${id}`;
    console.log(`Testing: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200 && data.startsWith('{')) {
            const parsed = JSON.parse(data);
            console.log(`Court ${id} - Found: ${parsed.name}`);
            resolve({ id, status: res.statusCode, data: parsed });
          } else {
            console.log(`Court ${id} - Status: ${res.statusCode} - Response: ${data.substring(0, 100)}...`);
            reject({ id, status: res.statusCode, response: data.substring(0, 200) });
          }
        } catch (error) {
          console.log(`Court ${id} - Parse Error: ${error.message}`);
          reject({ id, error: error.message, response: data.substring(0, 200) });
        }
      });
    }).on('error', (error) => {
      console.log(`Court ${id} - Network error: ${error.message}`);
      reject({ id, error: error.message });
    });
  });
}

async function testSpecificCourts() {
  console.log('Testing specific court endpoints...\n');

  const courtIds = [1, 2, 3, 4, 5, 10, 15];
  
  for (const id of courtIds) {
    try {
      await testCourtEndpoint(id);
    } catch (error) {
      console.error(`Error testing court ${id}:`, error);
    }
    console.log('');
  }
  
  console.log('Test completed!');
}

testSpecificCourts();

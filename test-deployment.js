#!/usr/bin/env node

/**
 * Neko-Webscout Deployment Test Script
 * Tests the deployed application to ensure all features work correctly
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';
const TIMEOUT = 10000; // 10 seconds

console.log('🧪 Testing Neko-Webscout Deployment');
console.log(`📍 Base URL: ${BASE_URL}`);
console.log('');

// Test cases
const tests = [
  {
    name: 'Health Check',
    endpoint: '/api/health',
    method: 'GET',
    expectedStatus: 200,
    expectedContent: 'healthy'
  },
  {
    name: 'Get Providers',
    endpoint: '/api/providers',
    method: 'GET',
    expectedStatus: 200,
    expectedContent: 'providers'
  },
  {
    name: 'Get Models',
    endpoint: '/api/models',
    method: 'GET',
    expectedStatus: 200,
    expectedContent: 'providers'
  },
  {
    name: 'Frontend Serving',
    endpoint: '/',
    method: 'GET',
    expectedStatus: 200,
    expectedContent: 'html'
  }
];

// Test runner
async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      
      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.endpoint}`,
        timeout: TIMEOUT,
        validateStatus: () => true // Don't throw on non-2xx status
      });

      // Check status code
      if (response.status !== test.expectedStatus) {
        throw new Error(`Expected status ${test.expectedStatus}, got ${response.status}`);
      }

      // Check content
      const responseText = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data);
      
      if (!responseText.toLowerCase().includes(test.expectedContent.toLowerCase())) {
        throw new Error(`Expected content containing "${test.expectedContent}"`);
      }

      console.log(`✅ ${test.name}: PASSED`);
      passed++;

    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log('');
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('');
    console.log('🎉 All tests passed! Deployment is working correctly.');
    console.log('');
    console.log('🌐 Your application is ready at:');
    console.log(`   ${BASE_URL}`);
    console.log('');
    console.log('📋 Available features:');
    console.log('   • Token validation (NewAPI & Webscout)');
    console.log('   • 90+ AI providers');
    console.log('   • AI chat interface');
    console.log('   • Web search');
    console.log('   • Image generation');
    console.log('   • Text-to-speech');
    console.log('   • Weather information');
    process.exit(0);
  } else {
    console.log('');
    console.log('⚠️  Some tests failed. Please check the deployment configuration.');
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   • Verify environment variables are set correctly');
    console.log('   • Check Render.com build logs for errors');
    console.log('   • Ensure both frontend and backend are properly built');
    console.log('   • Confirm the service is fully started (may take a few minutes)');
    process.exit(1);
  }
}

// Additional deployment verification
async function verifyDeployment() {
  console.log('🔍 Verifying deployment configuration...');
  
  try {
    // Test if it's a Render.com deployment
    const healthResponse = await axios.get(`${BASE_URL}/api/health`, { timeout: TIMEOUT });
    
    if (healthResponse.data && healthResponse.data.service === 'neko-webscout-fullstack') {
      console.log('✅ Confirmed: Neko-Webscout Full-Stack deployment');
    }

    // Check if frontend is properly served
    const frontendResponse = await axios.get(BASE_URL, { timeout: TIMEOUT });
    if (frontendResponse.data.includes('Neko') || frontendResponse.data.includes('React')) {
      console.log('✅ Frontend is properly served');
    }

  } catch (error) {
    console.log('⚠️  Could not verify deployment details');
  }

  console.log('');
}

// Main execution
async function main() {
  try {
    await verifyDeployment();
    await runTests();
  } catch (error) {
    console.log('❌ Test execution failed:');
    console.log(`   ${error.message}`);
    console.log('');
    console.log('🔧 Please check:');
    console.log('   • Is the application running?');
    console.log('   • Is the URL correct?');
    console.log('   • Are there any network issues?');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.length > 2) {
  const customUrl = process.argv[2];
  process.env.TEST_URL = customUrl;
  console.log(`🎯 Using custom URL: ${customUrl}`);
}

main();

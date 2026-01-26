/**
 * Load Tests - Authentication Stress Testing
 * 
 * Scripts to simulate high load on authentication endpoints
 * and measure system performance under stress.
 * 
 * Usage: Run with k6 or simulate with concurrent requests
 * k6 run load/auth-stress.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');
const sessionDuration = new Trend('session_duration');
const failedLogins = new Counter('failed_logins');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Warm up with 10 users
    { duration: '5m', target: 50 },   // Ramp up to 50 users
    { duration: '10m', target: 50 },  // Stay at 50 users
    { duration: '2m', target: 100 },  // Spike to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% under 500ms, 99% under 1s
    errors: ['rate<0.01'],                            // Less than 1% errors
    login_duration: ['avg<200'],                      // Average login under 200ms
  },
};

// Test data - should be generated dynamically in real tests
const testUsers = Array.from({ length: 1000 }, (_, i) => ({
  email: `loadtest${i}@test.example.com`,
  password: 'TestPassword123!',
}));

export function setup() {
  // Create test users or load from file
  console.log(`Created ${testUsers.length} test users for load testing`);
  return { users: testUsers };
}

export default function (data) {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
  const user = data.users[Math.floor(Math.random() * data.users.length)];
  
  // Test 1: Login Performance
  const loginStart = Date.now();
  
  const loginResponse = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'k6-load-test',
      },
    }
  );
  
  loginDuration.add(Date.now() - loginStart);
  
  const loginSuccess = check(loginResponse, {
    'login returns 200': (r) => r.status === 200,
    'login returns session token': (r) => r.headers['Set-Cookie'] !== undefined,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  if (!loginSuccess) {
    errorRate.add(1);
    failedLogins.add(1);
  } else {
    errorRate.add(0);
  }
  
  // Test 2: Session Validation
  if (loginSuccess) {
    const sessionStart = Date.now();
    
    const sessionResponse = http.get(
      `${baseUrl}/api/auth/session`,
      {
        headers: {
          'Cookie': loginResponse.headers['Set-Cookie'],
          'User-Agent': 'k6-load-test',
        },
      }
    );
    
    sessionDuration.add(Date.now() - sessionStart);
    
    check(sessionResponse, {
      'session check returns 200': (r) => r.status === 200,
      'session response contains user data': (r) => r.json('user') !== undefined,
    });
  }
  
  // Simulate user think time
  sleep(Math.random() * 3 + 1);
  
  // Test 3: Logout
  if (loginSuccess) {
    const logoutResponse = http.post(
      `${baseUrl}/api/auth/logout`,
      {},
      {
        headers: {
          'Cookie': loginResponse.headers['Set-Cookie'],
          'Content-Type': 'application/json',
        },
      }
    );
    
    check(logoutResponse, {
      'logout returns 200': (r) => r.status === 200,
    });
  }
  
  // Brief pause between iterations
  sleep(1);
}

export function handleSummary(data) {
  return {
    'load/auth-summary.json': JSON.stringify(data, null, 2),
    stdout: `Load Test Results:
===============
Total Requests: ${data.metrics.http_reqs.values.count}
Successful Requests: ${data.metrics.http_reqs.values.rate * 100 - data.metrics.errors.values.rate * 100}%
Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%
Avg Login Duration: ${data.metrics.login_duration.values.avg.toFixed(2)}ms
95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
Failed Logins: ${data.metrics.failed_logins.values}
`,
  };
}

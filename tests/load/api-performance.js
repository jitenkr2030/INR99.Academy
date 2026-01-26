/**
 * Load Tests - API Endpoint Performance Testing
 * 
 * Scripts to simulate high load on various API endpoints
 * and measure system performance under concurrent access.
 * 
 * Usage: Run with k6
 * k6 run load/api-performance.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('api_errors');
const responseTime = new Trend('api_response_time');
const endpointErrors = new Counter('endpoint_errors');
const cacheHits = new Counter('cache_hits');
const cacheMisses = new Counter('cache_misses');

// Test configuration
export const options = {
  scenarios: {
    // Scenario 1: Course browsing (high read, low write)
    course_browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 30 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'testCourseBrowsing',
    },
    
    // Scenario 2: User dashboard (mixed read/write)
    user_dashboard: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },
        { duration: '5m', target: 40 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'testUserDashboard',
    },
    
    // Scenario 3: Admin operations (low volume, sensitive)
    admin_operations: {
      executor: 'constant-arrival-rate',
      rate: 5,  // 5 requests per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 20,
      exec: 'testAdminOperations',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
    errors: ['rate<0.02'],
    api_response_time: ['avg<300'],
  },
};

// Test data
const testCourses = Array.from({ length: 100 }, (_, i) => ({
  id: `course_${i + 1}`,
  slug: `course-slug-${i + 1}`,
  category: ['programming', 'business', 'design'][i % 3],
}));

const testUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `user_${i + 1}`,
  email: `loadtest${i + 1}@test.example.com`,
}));

export function testCourseBrowsing() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
  
  group('Course Listing', function () {
    const response = http.get(
      `${baseUrl}/api/courses`,
      {
        headers: { 'User-Agent': 'k6-api-load-test' },
      }
    );
    
    const success = check(response, {
      'courses list returns 200': (r) => r.status === 200,
      'courses list returns array': (r) => Array.isArray(r.json()),
      'response time < 300ms': (r) => r.timings.duration < 300,
    });
    
    responseTime.add(response.timings.duration);
    if (!success) endpointErrors.add('courses_list');
  });
  
  group('Course Details', function () {
    const course = testCourses[Math.floor(Math.random() * testCourses.length)];
    
    const response = http.get(
      `${baseUrl}/api/courses/${course.id}`,
      {
        headers: { 'User-Agent': 'k6-api-load-test' },
      }
    );
    
    check(response, {
      'course details returns 200': (r) => r.status === 200,
      'course has required fields': (r) => r.json('id') !== undefined,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  group('Course Categories', function () {
    const categories = ['programming', 'business', 'design'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const response = http.get(
      `${baseUrl}/api/categories/${category}`,
      {
        headers: { 'User-Agent': 'k6-api-load-test' },
      }
    );
    
    check(response, {
      'category returns 200': (r) => r.status === 200,
      'response time < 250ms': (r) => r.timings.duration < 250,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  sleep(Math.random() * 2 + 1);
}

export function testUserDashboard() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
  const user = testUsers[Math.floor(Math.random() * testUsers.length)];
  
  group('User Profile', function () {
    const response = http.get(
      `${baseUrl}/api/profile/${user.id}`,
      {
        headers: { 'User-Agent': 'k6-dashboard-test' },
      }
    );
    
    check(response, {
      'profile returns 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  group('User Enrollments', function () {
    const response = http.get(
      `${baseUrl}/api/enrollments/${user.id}`,
      {
        headers: { 'User-Agent': 'k6-dashboard-test' },
      }
    );
    
    check(response, {
      'enrollments returns 200': (r) => r.status === 200,
      'response time < 300ms': (r) => r.timings.duration < 300,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  group('User Progress', function () {
    const response = http.get(
      `${baseUrl}/api/progress/${user.id}`,
      {
        headers: { 'User-Agent': 'k6-dashboard-test' },
      }
    );
    
    check(response, {
      'progress returns 200': (r) => r.status === 200,
      'response time < 250ms': (r) => r.timings.duration < 250,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  sleep(Math.random() * 3 + 2);
}

export function testAdminOperations() {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
  
  group('Admin Analytics', function () {
    const response = http.get(
      `${baseUrl}/api/admin/analytics`,
      {
        headers: { 
          'User-Agent': 'k6-admin-test',
          'Authorization': 'Bearer admin-token',
        },
      }
    );
    
    check(response, {
      'analytics returns 200': (r) => r.status === 200,
      'analytics returns data': (r) => r.json('stats') !== undefined,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    responseTime.add(response.timings.duration);
  });
  
  group('Admin User Stats', function () {
    const response = http.get(
      `${baseUrl}/api/admin/stats/users`,
      {
        headers: { 
          'User-Agent': 'k6-admin-test',
          'Authorization': 'Bearer admin-token',
        },
      }
    );
    
    check(response, {
      'user stats returns 200': (r) => r.status === 200,
      'response time < 400ms': (r) => r.timings.duration < 400,
    });
    
    responseTime.add(response.timings.duration);
  });
}

export function handleSummary(data) {
  return {
    'load/api-summary.json': JSON.stringify(data, null, 2),
    stdout: `API Load Test Results:
======================
Total Requests: ${data.metrics.http_reqs.values.count}
Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%
Avg Response Time: ${data.metrics.api_response_time.values.avg.toFixed(2)}ms
95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
99th Percentile: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
Endpoint Errors: ${data.metrics.endpoint_errors.values}
`,
  };
}

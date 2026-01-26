# Load Tests Guide

This document provides detailed information about the load testing implementation in INR99.Academy using k6.

## Overview

Load tests validate system performance under concurrent access. These tests ensure the platform can handle expected traffic spikes and maintain performance under stress.

## Load Testing Tools

We use [k6](https://k6.io/) for load testing because:

- **Scriptable**: Write tests in JavaScript/TypeScript
- **CI/CD Integration**: Easy to integrate into pipelines
- **Rich Metrics**: Built-in metrics and custom metrics
- **Flexible Scenarios**: Support for various test types

## Test Categories

### 1. Authentication Stress Test (`tests/load/auth-stress.js`)

This test simulates high load on authentication endpoints:

```javascript
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
    http_req_duration: ['p(95)<500', 'p(99)<1000'],  // 95% under 500ms
    errors: ['rate<0.01'],                            // Less than 1% errors
    login_duration: ['avg<200'],                      // Average login under 200ms
  },
};
```

#### Test Scenarios

1. **Login Performance**
   - Attempts user login with test credentials
   - Measures response time
   - Validates session token is returned

2. **Session Validation**
   - Checks session validity
   - Measures session retrieval time

3. **Logout**
   - Ends user session
   - Validates successful logout

#### Metrics Tracked

| Metric | Target | Warning Threshold |
|--------|--------|-------------------|
| Login Duration (avg) | < 200ms | < 300ms |
| Login Duration (p95) | < 500ms | < 800ms |
| Error Rate | < 1% | < 2% |
| Failed Logins | < 10 | < 50 |

### 2. Payment Processing Test (`tests/load/payment-spike.js`)

This test simulates payment webhook spikes:

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 5 },    // Warm up
    { duration: '2m', target: 20 },   // Normal load
    { duration: '5m', target: 50 },   // High load
    { duration: '3m', target: 100 },  // Stress test
    { duration: '2m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'],
    errors: ['rate<0.005'],            // Less than 0.5% errors
    webhook_duration: ['avg<150'],     // Average webhook under 150ms
    order_creation_duration: ['avg<500'],
  },
};
```

#### Test Scenarios

1. **Order Creation**
   - Creates new payment orders
   - Measures order creation time
   - Validates payment session is returned

2. **Payment Webhook Processing**
   - Simulates payment gateway callbacks
   - Tests both success and failure scenarios
   - Measures webhook processing time

3. **Idempotency Checks**
   - Sends duplicate webhooks
   - Validates idempotent processing

4. **Payment Status Check**
   - Queries payment status
   - Measures status retrieval time

#### Metrics Tracked

| Metric | Target | Warning Threshold |
|--------|--------|-------------------|
| Webhook Duration (avg) | < 150ms | < 250ms |
| Order Creation (avg) | < 500ms | < 800ms |
| Error Rate | < 0.5% | < 1% |
| Idempotency Checks | All pass | < 1% duplicate failures |

### 3. API Performance Test (`tests/load/api-performance.js`)

This test simulates various API access patterns:

```javascript
export const options = {
  scenarios: {
    course_browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 30 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 0 },
      ],
      exec: 'testCourseBrowsing',
    },
    
    user_dashboard: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 },
        { duration: '5m', target: 40 },
        { duration: '2m', target: 0 },
      ],
      exec: 'testUserDashboard',
    },
    
    admin_operations: {
      executor: 'constant-arrival-rate',
      rate: 5,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 20,
      exec: 'testAdminOperations',
    },
  },
};
```

#### Scenario 1: Course Browsing (30-50 VUs)

```javascript
export function testCourseBrowsing() {
  group('Course Listing', function () {
    const response = http.get(`${baseUrl}/api/courses`);
    check(response, {
      'courses list returns 200': (r) => r.status === 200,
      'response time < 300ms': (r) => r.timings.duration < 300,
    });
  });
  
  group('Course Details', function () {
    const course = testCourses[Math.floor(Math.random() * testCourses.length)];
    const response = http.get(`${baseUrl}/api/courses/${course.id}`);
    check(response, {
      'course details returns 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  });
}
```

#### Scenario 2: User Dashboard (20-40 VUs)

```javascript
export function testUserDashboard() {
  group('User Profile', function () {
    const response = http.get(`${baseUrl}/api/profile/${user.id}`);
    check(response, {
      'profile returns 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  });
  
  group('User Enrollments', function () {
    const response = http.get(`${baseUrl}/api/enrollments/${user.id}`);
    check(response, {
      'enrollments returns 200': (r) => r.status === 200,
      'response time < 300ms': (r) => r.timings.duration < 300,
    });
  });
}
```

#### Scenario 3: Admin Operations (5 req/sec)

```javascript
export function testAdminOperations() {
  group('Admin Analytics', function () {
    const response = http.get(`${baseUrl}/api/admin/analytics`, {
      headers: { 'Authorization': 'Bearer admin-token' },
    });
    check(response, {
      'analytics returns 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}
```

## Running Load Tests

### Prerequisites

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/docs/get-started/installation/

# Verify installation
k6 version
```

### Basic Commands

```bash
# Run authentication stress test
k6 run tests/load/auth-stress.js

# Run payment spike test
k6 run tests/load/payment-spike.js

# Run API performance test
k6 run tests/load/api-performance.js
```

### Advanced Options

```bash
# Run with environment variables
BASE_URL=http://localhost:3000 \
NEXTAUTH_SECRET=test-secret \
k6 run tests/load/auth-stress.js

# Run with output files
k6 run \
  --out json=results/auth-results.json \
  --out html=results/auth-report.html \
  tests/load/auth-stress.js

# Run with specific duration
k6 run --duration 2m tests/load/auth-stress.js

# Run with specific VUs
k6 run --vus 100 --duration 5m tests/load/auth-stress.js

# Run in cloud mode (requires k6 Cloud)
k6 cloud tests/load/auth-stress.js
```

### Test Data Generation

```bash
# Generate test users
npm run test:generate-users

# Generate test courses
npm run test:generate-courses

# Generate all test data
npm run test:generate-data
```

## Load Test Coverage

| Scenario | Target Load | Duration | Status |
|----------|-------------|----------|--------|
| Authentication Stress | 50-100 concurrent users | 24 min | ✅ Complete |
| Payment Processing | 20-100 req/sec | 13 min | ✅ Complete |
| Course Browsing | 30-50 VUs | 9 min | ✅ Complete |
| User Dashboard | 20-40 VUs | 9 min | ✅ Complete |
| Admin Operations | 5 req/sec | 5 min | ✅ Complete |

## Performance Benchmarks

### Response Time Targets

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| /api/auth/login | < 100ms | < 500ms | < 1000ms |
| /api/auth/session | < 50ms | < 200ms | < 500ms |
| /api/courses | < 150ms | < 300ms | < 600ms |
| /api/courses/:id | < 100ms | < 200ms | < 400ms |
| /api/payments/verify | < 75ms | < 150ms | < 300ms |
| /api/profile/:id | < 100ms | < 200ms | < 400ms |

### Throughput Targets

| Endpoint | Requests/Second |
|----------|-----------------|
| /api/courses | 500 |
| /api/courses/:id | 1000 |
| /api/payments/verify | 100 |
| /api/profile/:id | 500 |

## Interpreting Results

### Key Metrics

```bash
# Example output
Load Test Results:
===============
Total Requests: 125,432
Successful Requests: 99.2%
Error Rate: 0.8%
Avg Login Duration: 156ms
95th Percentile: 342ms
99th Percentile: 567ms
Failed Logins: 45
```

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Database bottleneck | High response times | Add read replicas |
| Memory leak | Increasing memory usage | Profile and fix leak |
| Connection pool exhaustion | Connection errors | Increase pool size |
| CPU saturation | 100% CPU usage | Optimize code |
| Network latency | High p99 | CDN or edge caching |

### Threshold Failures

```bash
# If thresholds are exceeded, the test fails
ERRO[0603] thresholds on metrics 'http_req_duration' have been violated
```

Check the output for specific metrics that failed and investigate accordingly.

## CI/CD Integration

### GitHub Actions

```yaml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-k6@v1
        with:
          k6-version: latest
      - name: Run Authentication Load Test
        run: k6 run tests/load/auth-stress.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      - name: Run Payment Load Test
        run: k6 run tests/load/payment-spike.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      - name: Upload Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: load-test-results
          path: |
            load/*.json
            load/*.html
```

## Best Practices

1. **Warm up before testing** - Gradually increase load
2. **Use realistic data** - Generate representative test data
3. **Test in production-like environment** - Similar infrastructure
4. **Monitor system resources** - CPU, memory, network, disk
5. **Establish baselines** - Track performance over time
6. **Set meaningful thresholds** - Based on SLAs
7. **Document results** - Maintain performance history

## Related Documentation

- [Advanced Testing Suite](../ADVANCED_TESTING_SUITE.md)
- [Security Tests Guide](SECURITY_TESTS.md)
- [Failure Tests Guide](FAILURE_TESTS.md)
- [k6 Documentation](https://k6.io/docs/)
- [Performance Testing Best Practices](https://k6.io/docs/get-started/best-practices/)

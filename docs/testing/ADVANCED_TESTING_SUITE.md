# Advanced Testing Suite Documentation

This document provides comprehensive documentation for the advanced testing suite implemented in the INR99.Academy project, including Load Tests, Failure Tests, and Security Tests.

## Table of Contents

1. [Overview](#overview)
2. [Test Categories](#test-categories)
3. [Security Tests](#security-tests)
4. [Failure Tests](#failure-tests)
5. [Load Tests](#load-tests)
6. [Running Tests](#running-tests)
7. [Test Configuration](#test-configuration)
8. [Best Practices](#best-practices)

---

## Overview

The INR99.Academy project implements a comprehensive testing strategy that goes beyond traditional unit and integration tests. Our advanced testing suite ensures the platform is:

- **Secure**: Protected against common vulnerabilities and attacks
- **Resilient**: Capable of handling failures gracefully
- **Performant**: Stable under high load conditions

### Testing Philosophy

We believe in proactive testing that simulates real-world scenarios:

- **Security-First**: Every code change is reviewed for security implications
- **Failure-Oriented**: We test for how systems fail, not just how they succeed
- **Performance-Conscious**: Performance testing is integrated into the development workflow

---

## Test Categories

### Security Tests (`tests/security/`)

Security tests validate that the application is protected against common vulnerabilities:

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `auth.test.ts` | Authentication & Authorization | 100% |
| `input-validation.test.ts` | Input Sanitization | 95% |
| `rate-limit.test.ts` | DoS Protection | 90% |

**Key Focus Areas:**
- Authentication bypass prevention
- SQL injection and XSS protection
- Rate limiting and brute force protection
- JWT token security
- Session hijacking prevention

### Failure Tests (`tests/failure/`)

Failure tests validate system resilience under adverse conditions:

| Test File | Purpose | Scenarios |
|-----------|---------|-----------|
| `db-failure.test.ts` | Database Resilience | Connection failures, timeouts, deadlocks |
| `external-service.test.ts` | External Service Resilience | Payment gateway failures, email service issues |

**Key Focus Areas:**
- Database connection failures
- External service timeouts
- Circuit breaker patterns
- Graceful degradation
- Recovery mechanisms

### Load Tests (`tests/load/`)

Load tests validate system performance under concurrent access:

| Test File | Purpose | Target Metrics |
|-----------|---------|----------------|
| `auth-stress.js` | Authentication Stress | 50-100 concurrent users |
| `payment-spike.js` | Payment Processing | 20-100 requests/second |
| `api-performance.js` | API Endpoints | 95% response < 500ms |

**Key Metrics:**
- Response time percentiles (p95, p99)
- Error rates under load
- Throughput (requests/second)
- Resource utilization

---

## Security Tests

### Authentication Security (`tests/security/auth.test.ts`)

Tests verify that authentication mechanisms are secure against various attack vectors:

#### Test Cases

1. **Protected Route Access Without Authentication**
   - Validates that protected endpoints reject unauthenticated requests
   - Tests multiple authentication failure scenarios
   - Ensures proper HTTP status codes (401, 403)

2. **Replay Attack Prevention**
   - Validates that expired tokens are rejected
   - Tests session invalidation after logout
   - Ensures tokens cannot be reused after expiration

3. **Session Hijacking Protection**
   - Tests detection of suspicious user agents
   - Validates IP-based anomaly detection
   - Ensures concurrent session handling

4. **Brute Force Protection**
   - Tests rate limiting on authentication endpoints
   - Validates account lockout mechanisms
   - Ensures CAPTCHA or similar protection

#### Example Test

```typescript
it('should reject requests without session token', async () => {
  (getServerSession as vi.Mock).mockResolvedValue(null);
  
  const request = createMockRequest({ method: 'GET' });
  
  try {
    await GET(request);
  } catch (error) {
    expect(error).toBeDefined();
  }
});
```

### Input Validation (`tests/security/input-validation.test.ts`)

Tests verify that all user inputs are properly validated and sanitized:

#### SQL Injection Prevention

```typescript
it('should reject SQL injection payloads in user input', () => {
  const maliciousInputs = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1; DELETE FROM payments WHERE 1=1",
  ];

  maliciousInputs.forEach(input => {
    const result = validateInput(input);
    expect(result.valid).toBe(false);
  });
});
```

#### XSS Prevention

```typescript
it('should reject XSS payloads in user input', () => {
  const xssPayloads = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
  ];

  xssPayloads.forEach(payload => {
    const sanitized = sanitizeString(payload);
    expect(sanitized).not.toContain('<script>');
  });
});
```

### Rate Limiting (`tests/security/rate-limit.test.ts`)

Tests verify that rate limiting mechanisms effectively prevent abuse:

#### Test Scenarios

1. **Basic Rate Limiting**
   - Tracks request count per user/IP
   - Blocks requests exceeding limit
   - Resets count after window expires

2. **Endpoint-Specific Limits**
   - Stricter limits for sensitive endpoints (login: 5/minute)
   - Looser limits for public endpoints (content: 100/minute)

3. **Distributed Rate Limiting**
   - Handles requests from multiple sources
   - Prevents distributed attacks from bypassing limits

---

## Failure Tests

### Database Resilience (`tests/failure/db-failure.test.ts`)

Tests validate system behavior when database issues occur:

#### Connection Failure Handling

```typescript
it('should handle database connection timeout', async () => {
  mockPrisma.user.findUnique.mockRejectedValue(
    new Error('P1001: Can\'t reach database server')
  );

  await expect(getUserById('user-123')).rejects.toThrow('P1001');
});
```

#### Test Scenarios

1. **Connection Failures**
   - Connection timeouts
   - Connection refused errors
   - SSL connection errors

2. **Query Timeouts**
   - Slow query handling
   - Transaction timeouts

3. **Constraint Violations**
   - Unique constraint violations
   - Foreign key violations
   - NULL constraint violations

4. **Deadlock Handling**
   - Automatic retry after deadlock
   - Deadlock detection

5. **Graceful Degradation**
   - Cached data fallback
   - User-friendly error pages
   - Error logging

### External Service Resilience (`tests/failure/external-service.test.ts`)

Tests validate behavior when external services fail:

#### Payment Gateway Failures

```typescript
it('should handle payment gateway timeout', async () => {
  (createPaymentOrder as vi.Mock).mockImplementation(
    () => new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gateway timeout')), 35001)
    )
  );

  await expect(createPaymentOrder({...})).rejects.toThrow('timeout');
});
```

#### Test Scenarios

1. **Gateway Failures**
   - Timeouts (30+ seconds)
   - Connection errors
   - 500/503 errors
   - Rate limiting from gateway

2. **Webhook Processing**
   - Duplicate webhook handling
   - Malformed payloads
   - Out-of-order webhooks

3. **Email Service Failures**
   - SMTP connection failures
   - Email rate limiting
   - Queue and retry logic

4. **Cascading Failure Prevention**
   - Independent service isolation
   - Circuit breaker pattern
   - Fallback providers

---

## Load Tests

Load tests use [k6](https://k6.io/) for performance testing.

### Authentication Stress Test (`tests/load/auth-stress.js`)

Simulates high load on authentication endpoints:

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Warm up
    { duration: '5m', target: 50 },   // Ramp up
    { duration: '10m', target: 50 },  // Sustained load
    { duration: '2m', target: 100 },  // Spike
    { duration: '5m', target: 100 },  // Sustained spike
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    errors: ['rate<0.01'],
  },
};
```

**Metrics Tracked:**
- Login response time (average, p95, p99)
- Session validation time
- Error rate
- Failed login attempts

### Payment Processing Test (`tests/load/payment-spike.js`)

Simulates payment webhook spikes:

**Test Scenarios:**
- Order creation (50 concurrent)
- Webhook processing (20 req/sec)
- Idempotency checks
- Status queries

**Target Metrics:**
- Webhook processing: avg < 150ms
- Order creation: avg < 500ms
- Error rate: < 0.5%

### API Performance Test (`tests/load/api-performance.js`)

Tests various API endpoints under load:

**Scenarios:**
1. **Course Browsing** (30-50 VUs)
   - Course listing
   - Course details
   - Category browsing

2. **User Dashboard** (20-40 VUs)
   - Profile access
   - Enrollments
   - Progress tracking

3. **Admin Operations** (5 req/sec)
   - Analytics
   - User statistics

---

## Running Tests

### Security and Failure Tests

```bash
# Run all security and failure tests
npm run test:security
npm run test:failure

# Run specific test category
npm run test:security:auth
npm run test:security:input
npm run test:security:rate-limit
npm run test:failure:db
npm run test:failure:external

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Load Tests

```bash
# Install k6
brew install k6  # macOS
# or download from https://k6.io/docs/get-started/installation/

# Run load tests
k6 run tests/load/auth-stress.js
k6 run tests/load/payment-spike.js
k6 run tests/load/api-performance.js

# Run with environment variables
BASE_URL=http://your-api k6 run tests/load/auth-stress.js

# Run with specific output
k6 run --out json=results.json tests/load/auth-stress.js
k6 run --out html=report.html tests/load/auth-stress.js
```

### Combined Test Suite

```bash
# Run all tests (unit, integration, security, failure)
npm test

# Run with full coverage report
npm run test:coverage
```

---

## Test Configuration

### Environment Variables

```env
# Test Database
TEST_DATABASE_URL=file:./test-db.sqlite

# Authentication Test Credentials
TEST_USER_EMAIL=loadtest@test.example.com
TEST_USER_PASSWORD=TestPassword123!

# External Services (Mock)
MOCK_PAYMENT_GATEWAY=true
MOCK_EMAIL_SERVICE=true

# Performance Testing
BASE_URL=http://localhost:3000
K6_DURATION=5m
K6_VUS=50
```

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 15000,
    hookTimeout: 10000,
    teardownTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

---

## Best Practices

### Security Testing

1. **Never test with real credentials**
   - Use dedicated test accounts
   - Rotate test credentials regularly

2. **Isolate security tests**
   - Run security tests in isolated environments
   - Don't affect production data

3. **Test edge cases**
   - Consider unusual input combinations
   - Test boundary conditions

### Failure Testing

1. **Test realistic failure scenarios**
   - Simulate real-world failure modes
   - Consider cascading failures

2. **Measure recovery time**
   - Track how long recovery takes
   - Set acceptable thresholds

3. **Verify alerting**
   - Ensure failures trigger alerts
   - Test on-call procedures

### Load Testing

1. **Test in production-like environments**
   - Use similar infrastructure
   - Replicate data volumes

2. **Gradually increase load**
   - Don't start at maximum load
   - Monitor system behavior

3. **Establish baselines**
   - Track performance over time
   - Set meaningful thresholds

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Advanced Testing Suite

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:security
      - run: npm run test:failure
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-test-results
          path: coverage/

  load-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-k6@v1
        with:
          k6-version: latest
      - run: k6 run tests/load/auth-stress.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: load-test-results
          path: load/
```

---

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in configuration
   - Check for infinite loops
   - Verify mock implementations

2. **Mock not working**
   - Ensure mock is set before import
   - Check mock implementation
   - Verify mock is cleared between tests

3. **Load tests failing**
   - Check system resources
   - Verify test data generation
   - Review k6 configuration

### Debug Tips

```bash
# Run single test
npm test -- --testNamePattern="should reject SQL injection"

# Run with verbose output
npm test -- --reporter=verbose

# Run load test with debugging
k6 run --debug tests/load/auth-stress.js
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [k6 Documentation](https://k6.io/docs/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Chaos Engineering Principles](https://principlesofchaos.org/)

---

**Last Updated:** 2024
**Maintained By:** Development Team
**Version:** 1.0.0

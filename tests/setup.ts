/**
 * Test Setup and Global Configuration
 *
 * This file configures the test environment for Vitest,
 * including global mocks, environment variable setup,
 * and cleanup handlers.
 */

import { afterEach, beforeAll, vi } from 'vitest';

// Extend Jest types for Vitest
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'development' | 'production';
      NEXT_PUBLIC_APP_URL: string;
      CASHFREE_APP_ID: string;
      CASHFREE_SECRET_KEY: string;
      CASHFREE_API_URL: string;
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY_ID: string;
      AWS_REGION: string;
      AWS_BUCKET_NAME: string;
    }
  }
}

// Polyfill Headers for Node.js environment (not available natively)
class HeadersPolyfill {
  private headers: Map<string, string> = new Map();

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }

  get(name: string): string | null {
    return this.headers.get(name.toLowerCase()) || null;
  }

  set(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value);
  }

  has(name: string): boolean {
    return this.headers.has(name.toLowerCase());
  }

  delete(name: string): void {
    this.headers.delete(name.toLowerCase());
  }

  append(name: string, value: string): void {
    const current = this.headers.get(name.toLowerCase());
    this.headers.set(name.toLowerCase(), current ? `${current}, ${value}` : value);
  }

  forEach(callback: (value: string, key: string) => void): void {
    this.headers.forEach((value, key) => callback(value, key));
  }

  keys(): IterableIterator<string> {
    return this.headers.keys();
  }

  values(): IterableIterator<string> {
    return this.headers.values();
  }

  entries(): IterableIterator<[string, string]> {
    return this.headers.entries();
  }
}

// Set test environment
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
  process.env.CASHFREE_APP_ID = 'test_app_id';
  process.env.CASHFREE_SECRET_KEY = 'test_secret_key';
  process.env.CASHFREE_API_URL = 'https://api.cashfree.com/pg';
  process.env.DATABASE_URL = 'file:./test.db';
  process.env.NEXTAUTH_SECRET = 'test_secret_key_for_jwt_signing';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
  process.env.AWS_ACCESS_KEY_ID = 'test_access_key';
  process.env.AWS_SECRET_ACCESS_KEY_ID = 'test_secret_key';
  process.env.AWS_REGION = 'ap-south-1';
  process.env.AWS_BUCKET_NAME = 'test-bucket';

  // Suppress console output during tests unless debugging
  if (!process.env.DEBUG_TESTS) {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Keep console.error visible for debugging test failures
  }

  // Mock fetch globally
  global.fetch = vi.fn();

  // Polyfill Headers for Node.js environment
  if (typeof global.Headers === 'undefined') {
    global.Headers = HeadersPolyfill as any;
  }
});

// Reset mocks and cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

export {};

// Reset mocks and cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

export {};

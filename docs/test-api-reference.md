# Test API Reference

This document provides a complete API reference for the test utilities, mock functions, and helper methods used in the INR99 Academy test suite.

## Table of Contents

1. [Global Test API](#global-test-api)
2. [Mock Utilities](#mock-utilities)
3. [Test Fixtures](#test-fixtures)
4. [Custom Matchers](#custom-matchers)
5. [Helper Functions](#helper-functions)
6. [Type Definitions](#type-definitions)

---

## Global Test API

Vitest provides these global functions automatically (enabled via `globals: true` in config).

### describe(name, fn)

Groups related tests together.

```typescript
describe('Authentication Module', () => {
  it('should authenticate user', () => { /* ... */ });
  it('should reject invalid credentials', () => { /* ... */ });
});
```

**Nested describes**: Can be nested to create logical groupings.

```typescript
describe('Payment Service', () => {
  describe('createOrder', () => {
    it('should create order successfully', () => { /* ... */ });
  });
  describe('verifyPayment', () => {
    it('should verify successful payment', () => { /* ... */ });
  });
});
```

### it(name, fn) / test(name, fn)

Defines a single test case.

```typescript
it('should return user when valid token is provided', () => {
  const user = getAuthenticatedUser(request);
  expect(user).not.toBeNull();
});
```

**Async tests**:

```typescript
it('should create order', async () => {
  const order = await cashfreeService.createOrder(params);
  expect(order.order_id).toBe('test_123');
});
```

**Pending tests** (skip):

```typescript
it.skip('should fail with invalid input', () => {
  // This test is skipped
});
```

**Focused tests** (only this test runs):

```typescript
it.only('should run only this test', () => {
  // Only this test will execute
});
```

### expect(value)

Creates an assertion. Returns a chainable object with matcher methods.

```typescript
expect(actual).toBe(expected);
expect(actual).toEqual(expected);
expect(actual).toBeNull();
```

---

## Mock Utilities

### vi Object

The `vi` object provides Vitest's mocking utilities.

#### vi.fn(implementation?)

Creates a mock function.

```typescript
// Simple mock
const mockFn = vi.fn();

// With implementation
const mockFn = vi.fn((x: number) => x * 2);
mockFn(5); // Returns 10
```

**Properties**:

```typescript
mockFn.mock.calls;        // Array of call arguments
mockFn.mock.results;      // Array of return values
mockFn.mock.instances;    // Array of `this` values
mockFn.mock.contexts;     // Array of contexts
```

**Examples**:

```typescript
const mockFn = vi.fn();

mockFn('arg1', 'arg2');
mockFn('arg3');

console.log(mockFn.mock.calls);
// [['arg1', 'arg2'], ['arg3']]
```

#### vi.spyOn(object, methodName)

Creates a spy on an object's method.

```typescript
const obj = {
  getData: () => 'real data',
};

const spy = vi.spyOn(obj, 'getData');
obj.getData(); // Calls the real function
expect(spy).toHaveBeenCalled();
```

#### vi.mock(path, factory)

Mocks a module.

```typescript
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));
```

**Async factory**:

```typescript
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual('@/lib/api');
  return {
    ...actual,
    fetchData: vi.fn(),
  };
});
```

#### vi.doMock(path, factory)

Similar to `vi.mock` but hoisted differently (allows conditional mocking).

```typescript
// Can be called inside tests for conditional mocks
vi.doMock('@/lib/config', () => ({
  featureFlag: true,
}));
```

#### vi.doUnmock(path)

Unmocks a module for subsequent imports.

```typescript
vi.doUnmock('@/lib/config');
```

#### vi.isMockFunction(fn)

Checks if a function is a mock.

```typescript
const realFn = () => {};
const mockFn = vi.fn();

vi.isMockFunction(realFn); // false
vi.isMockFunction(mockFn); // true
```

### Mock Configuration

#### mockFn.mockReturnValue(value)

Sets return value for the mock.

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('result');

mockFn(); // Returns 'result'
```

#### mockFn.mockReturnValueOnce(value)

Sets return value for a single call.

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValueOnce('first');
mockFn.mockReturnValueOnce('second');
mockFn(); // Returns 'first'
mockFn(); // Returns 'second'
mockFn(); // Returns undefined
```

#### mockFn.mockResolvedValue(value)

Sets resolved value for async mock.

```typescript
const mockFn = vi.fn();
mockFn.mockResolvedValue({ data: 'test' });

await mockFn(); // Resolves to { data: 'test' }
```

#### mockFn.mockResolvedValueOnce(value)

Sets resolved value for single async call.

```typescript
const mockFn = vi.fn();
mockFn.mockResolvedValueOnce({ data: 'first' });
mockFn.mockResolvedValueOnce({ data: 'second' });

await mockFn(); // Resolves to { data: 'first' }
await mockFn(); // Resolves to { data: 'second' }
```

#### mockFn.mockRejectedValue(error)

Sets rejected value for async mock.

```typescript
const mockFn = vi.fn();
mockFn.mockRejectedValue(new Error('Network error'));

await mockFn(); // Rejects with Error('Network error')
```

#### mockFn.mockImplementation(fn)

Sets implementation for mock.

```typescript
const mockFn = vi.fn();
mockFn.mockImplementation((x: number) => x * 3);

mockFn(5); // Returns 15
```

#### mockFn.mockImplementationOnce(fn)

Sets implementation for single call.

```typescript
const mockFn = vi.fn();
mockFn.mockImplementationOnce((x) => x + 1);
mockFn.mockImplementationOnce((x) => x + 2);
mockFn(5); // Returns 6
mockFn(5); // Returns 7
mockFn(5); // Returns undefined
```

#### mockFn.mockName(name)

Sets name for better error messages.

```typescript
const mockFn = vi.fn().mockName('fetchUser');
mockFn();
console.log(mockFn.mock.name); // 'fetchUser'
```

### Mock Reset

#### vi.clearAllMocks()

Clears all mock calls and instances.

```typescript
afterEach(() => {
  vi.clearAllMocks();
});
```

#### vi.resetAllMocks()

Clears mocks and resets implementation.

```typescript
afterEach(() => {
  vi.resetAllMocks();
});
```

#### vi.resetModules()

Removes all cached modules.

```typescript
beforeEach(() => {
  vi.resetModules();
});
```

#### mockFn.mockReset()

Resets the mock.

```typescript
mockFn.mockReset();
mockFn(); // Returns undefined
```

---

## Test Fixtures

### Location

Test fixtures are located in `tests/fixtures/`.

### Available Fixtures

#### test-data.ts

Contains mock data for tests.

```typescript
import { testUsers, testPayments, testOrders } from './test-data';

// Usage
const mockUser = testUsers.admin;
const mockPayment = testPayments.pending;
```

#### Available Test Data Types

| Type | Description |
|------|-------------|
| testUsers | Mock user objects with different roles |
| testPayments | Mock payment records in various states |
| testOrders | Mock order data for payment processing |
| testSites | Mock WordPress site configurations |
| testSessions | Mock NextAuth session objects |

---

## Custom Matchers

### Standard Matchers

```typescript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).toStrictEqual(expected);  // Strict deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(n);
expect(value).toBeGreaterThanOrEqual(n);
expect(value).toBeLessThan(n);
expect(value).toBeLessThanOrEqual(n);
expect(value).toBeCloseTo(n, precision);

// Strings
expect(str).toMatch(regex);
expect(str).toContain(substring);
expect(str).toHaveLength(n);

// Arrays
expect(arr).toContain(item);
expect(arr).toHaveLength(n);
expect(arr).toEqual(expect.arrayContaining([item]));

// Objects
expect(obj).toHaveProperty(key);
expect(obj).toHaveProperty(key, value);
expect(obj).toMatchObject(partialObj);
expect(obj).toEqual(expect.objectContaining(partialObj));

// Exceptions
expect(fn).toThrow();
expect(fn).toThrow('error message');
expect(fn).toThrow(Error);

// Mock
expect(fn).toHaveBeenCalled();
expect(fn).not.toHaveBeenCalled();
expect(fn).toHaveBeenCalledTimes(n);
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenLastCalledWith(arg1, arg2);
expect(fn).toHaveNthReturnedWith(n, value);
```

---

## Helper Functions

### Request Creation

#### createMockRequest(headers)

Creates a mock NextRequest object for testing.

```typescript
import { createMockRequest } from '@/tests/helpers';

const request = createMockRequest({
  authorization: 'Bearer test_token',
  'content-type': 'application/json',
});
```

**Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| headers | Record<string, string> | Request headers |

**Returns**: NextRequest

### Headers Helper

#### createMockHeaders(headers)

Creates a mock Headers object for Node.js environment.

```typescript
import { createMockHeaders } from '@/tests/helpers';

const headers = createMockHeaders({
  authorization: 'Bearer token',
  'x-request-id': '123',
});
```

**Returns**: Object with Headers-like interface (get, has, set, delete, append, forEach)

### Database Mock Helper

#### createMockDb(overrides)

Creates a mock database object with default values.

```typescript
import { createMockDb } from '@/tests/helpers';

const db = createMockDb({
  paymentRecord: {
    findFirst: vi.fn().mockResolvedValue(mockPayment),
  },
});
```

### Auth Mock Helper

#### createMockSession(user)

Creates a mock NextAuth session.

```typescript
import { createMockSession } from '@/tests/helpers';

const session = createMockSession({
  id: 'user_123',
  email: 'test@example.com',
});
```

---

## Type Definitions

### Test Types

```typescript
// Mock function type
type MockFn<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): ReturnType<T>;
  mock: {
    calls: Parameters<T>[];
    results: { type: 'return'; value: ReturnType<T> }[];
    instances: unknown[];
  };
  mockReturnValue(value: ReturnType<T>): MockFn<T>;
  mockResolvedValue(value: Awaited<ReturnType<T>>): MockFn<T>;
  mockRejectedValue(error: Error): MockFn<T>;
  mockImplementation(fn: T): MockFn<T>;
  mockReset(): void;
};

// Test result type
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'todo';
  duration: number;
  error?: Error;
  assertions: number;
}

// Test suite type
interface TestSuite {
  name: string;
  file: string;
  tests: TestResult[];
  duration: number;
  testsPassed: number;
  testsFailed: number;
  testsSkipped: number;
}
```

### Mock Data Types

```typescript
// Test user
interface TestUser {
  id: string;
  mobileNumber: string;
  email?: string;
  name?: string;
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
}

// Test payment
interface TestPayment {
  id: string;
  userId: string;
  paymentId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  type: 'SUBSCRIPTION' | 'ONE_TIME';
  metadata?: Record<string, any>;
}

// Test order
interface TestOrder {
  id: string;
  orderId: string;
  userId: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  metadata?: Record<string, any>;
}
```

### Environment Types

```typescript
interface TestEnvironment {
  NODE_ENV: 'test';
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
```

---

## Common Patterns

### Pattern: Async Test with Mocks

```typescript
it('should fetch user data', async () => {
  // Arrange
  const mockUser = { id: '1', name: 'Test' };
  vi.spyOn(api, 'getUser').mockResolvedValue(mockUser);
  
  // Act
  const user = await fetchUser('1');
  
  // Assert
  expect(user).toEqual(mockUser);
  expect(api.getUser).toHaveBeenCalledWith('1');
});
```

### Pattern: Testing Error Handling

```typescript
it('should throw error when API fails', async () => {
  vi.spyOn(api, 'fetchData').mockRejectedValue(new Error('Network error'));
  
  await expect(fetchData()).rejects.toThrow('Network error');
});
```

### Pattern: Testing Async Iterations

```typescript
it('should process items in parallel', async () => {
  const items = [1, 2, 3, 4, 5];
  const processFn = vi.fn().mockImplementation(async (n) => n * 2);
  
  const results = await Promise.all(items.map(processFn));
  
  expect(results).toEqual([2, 4, 6, 8, 10]);
});
```

### Pattern: Timer Mocking

```typescript
it('should execute after delay', async () => {
  vi.useFakeTimers();
  
  const callback = vi.fn();
  setTimeout(callback, 1000);
  
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
  vi.useRealTimers();
});
```

---

## Configuration Reference

### Vitest Configuration Types

```typescript
interface VitestConfig {
  test: {
    globals?: boolean;
    environment?: 'node' | 'jsdom' | 'happy-dom';
    setupFiles?: string[];
    include?: string[];
    exclude?: string[];
    testTimeout?: number;
    hookTimeout?: number;
    reporters?: Reporter[];
    coverage?: CoverageConfig;
  };
}
```

### Reporter Options

```typescript
type Reporter = 
  | 'default'
  | 'verbose'
  | 'json'
  | 'tap'
  | 'junit'
  | 'dot'
  | 'min'
  | 'html';
```

### Coverage Providers

```typescript
type CoverageProvider = 'v8' | 'istanbul' | 'embedded';
```

---

## Error Messages Reference

### Common Assertion Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Expected null not to be null | Assertion expects non-null value | Check if value is correctly passed |
| Expected 200 to be 201 | Status code mismatch | Verify expected status |
| Cannot read property of undefined | Accessing undefined property | Check mock return values |
| Timed out | Test exceeded timeout | Increase timeout or optimize test |
| Unexpected end of JSON input | Malformed JSON in token | Check token encoding |

### Mock Errors

| Error | Cause | Solution |
|-------|-------|----------|
| No "X" export on mock | Missing export in mock | Add missing export to mock |
| Not implemented yet | Mock not configured | Configure mock return value |
| Wrong arguments | Mock called with unexpected args | Check test setup |
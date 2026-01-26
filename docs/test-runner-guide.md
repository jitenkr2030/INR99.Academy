# Test Runner Guide

This guide explains how to run, debug, and extend the test suite for the INR99 Academy application.

## Quick Start

### Running All Tests

```bash
# Run all tests
npm test

# Run with verbose output
npm test -- --reporter=verbose

# Run with coverage report
npm test -- --coverage
```

### Running Specific Tests

```bash
# Run unit tests only
npm test -- tests/unit/

# Run integration tests only
npm test -- tests/integration/

# Run a specific test file
npm test -- tests/unit/auth.test.ts

# Run a specific test
npm test -- -t "should return null when authorization header is missing"
```

---

## Test Commands Reference

### Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests with Vitest |
| `npm run test:watch` | Run tests in watch mode for development |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Run tests with Vitest UI (if enabled) |

### Vitest CLI Options

| Option | Short | Description |
|--------|-------|-------------|
| `--run` | `-r` | Run tests once and exit (default for CI) |
| `--watch` | `-w` | Watch for changes and rerun tests |
| `--reporter` | `-R` | Specify reporter (default, verbose, json, tap) |
| `--coverage` | `-c` | Generate coverage report |
| `--update` | `-u` | Update snapshots |
| `--verbose` | `-v` | Show individual test results |
| `--filter` | `-t` | Filter tests by name pattern |

Examples:

```bash
# Run tests once (no watch mode)
npm test -- --run

# Run with JSON reporter for CI
npm test -- --reporter=json --output-file=test-results.json

# Update snapshots
npm test -- --update

# Run tests matching a pattern
npm test -- -t "Authentication"
```

---

## Debugging Tests

### Using Console Logs

Enable debug output by setting the `DEBUG_TESTS` environment variable:

```bash
DEBUG_TESTS=1 npm test
```

This will show `console.log`, `console.info`, and `console.warn` output during tests.

### Using Breakpoints

For VS Code, create a `.vscode/launch.json` configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--config", "${workspaceFolder}/vitest.config.ts"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Using Node.js Inspector

```bash
# Run tests with debugger
node --inspect-brk node_modules/vitest/vitest.mjs run

# Open Chrome DevTools and connect to debugger
```

### Common Debugging Techniques

#### 1. Print Test Data

```typescript
it('should debug test', () => {
  console.log('Debug data:', someObject);
  expect(someObject).toEqual(expected);
});
```

#### 2. Check Mock Calls

```typescript
it('should verify mock was called', () => {
  const mockFn = vi.fn();
  // ... test code ...
  console.log('Mock calls:', mockFn.mock.calls);
  console.log('Mock instances:', mockFn.mock.results);
});
```

#### 3. Test Isolation

When tests interfere with each other, use `vi.resetModules()`:

```typescript
it('should isolate module', () => {
  vi.resetModules();
  // Import fresh module
  const { myFunction } = await import('@/lib/myModule');
});
```

---

## Writing New Tests

### Test File Structure

Follow this template for new test files:

```typescript
/**
 * Test Suite for [Module Name]
 *
 * Description of what this module does and what the tests cover.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { functionToTest } from '@/path/to/module';

describe('Module Name', () => {
  let mockDependency: any;

  beforeEach(() => {
    // Setup mocks
    mockDependency = { /* ... */ };
    vi.spyOn(module, 'method').mockImplementation();
  });

  afterEach(() => {
    // Cleanup
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('Function/Feature Name', () => {
    it('should do expected behavior', () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });

    it('should handle edge case', () => {
      // Test edge case
    });
  });
});
```

### Mocking Patterns

#### 1. Mocking External Libraries

```typescript
vi.mock('external-library', () => ({
  default: {
    method: vi.fn().mockReturnValue('mocked value'),
  },
  namedExport: vi.fn(),
}));
```

#### 2. Mocking Internal Modules

```typescript
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));
```

#### 3. Spying on Functions

```typescript
// Spy on imported function
vi.spyOn(module, 'internalFunction').mockReturnValue('mocked');

// Spy on object method
vi.spyOn(object, 'methodName').mockImplementation(() => 'mocked');
```

#### 4. Async Mocks

```typescript
// For async functions
vi.spyOn(service, 'fetchData').mockResolvedValue({ data: 'test' });

// For rejected promises
vi.spyOn(service, 'fetchData').mockRejectedValue(new Error('Network error'));
```

### Test Assertions Reference

#### Common Expect Methods

| Method | Usage |
|--------|-------|
| `expect(value).toBe(expected)` | Strict equality (===) |
| `expect(value).toEqual(expected)` | Deep equality |
| `expect(value).toBeNull()` | Check for null |
| `expect(value).toBeUndefined()` | Check for undefined |
| `expect(value).toBeTruthy()` | Check for truthy |
| `expect(value).toBeFalsy()` | Check for falsy |
| `expect(value).toContain(item)` | Array/string contains item |
| `expect(value).toHaveLength(n)` | Array has length n |
| `expect(value).toThrow()` | Function throws |
| `expect(value).toMatch(regex)` | String matches regex |
| `expect(value).toMatchObject(obj)` | Partial object match |
| `expect(fn).toHaveBeenCalled()` | Mock was called |
| `expect(fn).toHaveBeenCalledTimes(n)` | Mock called n times |
| `expect(fn).toHaveBeenCalledWith(...args)` | Mock called with args |

#### Negating Assertions

```typescript
expect(value).not.toBe(expected);
expect(fn).not.toHaveBeenCalled();
expect(arr).not.toContain(item);
```

#### Custom Matchers

```typescript
// Object containing
expect(obj).toEqual(
  expect.objectContaining({
    key: 'value',
  })
);

// String containing
expect(str).toEqual(
  expect.stringContaining('substring')
);

// Array containing
expect(arr).toEqual(
  expect.arrayContaining(['item'])
);

// Any of
expect(value).toBeOneOf([val1, val2]);
```

---

## Test Configuration

### Environment Variables

Create a `.env.test` file for test-specific environment variables:

```env
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
CASHFREE_APP_ID=test_app_id
CASHFREE_SECRET_KEY=test_secret_key
CASHFREE_API_URL=https://api.cashfree.com/pg
DATABASE_URL=file:./test.db
NEXTAUTH_SECRET=test_secret_key_for_jwt_signing
NEXTAUTH_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=test_access_key
AWS_SECRET_ACCESS_KEY_ID=test_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=test-bucket
DEBUG_TESTS=
```

### Vitest Config Options

Key configuration options in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    // Enable global test APIs (describe, it, expect, vi)
    globals: true,
    
    // Test environment (node, jsdom, happy-dom)
    environment: 'node',
    
    // Setup files to run before tests
    setupFiles: ['./tests/setup.ts'],
    
    // Test file patterns
    include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
    
    // Exclude patterns
    exclude: ['node_modules', 'dist', '.git'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.d.ts', '**/test/**', '**/node_modules/**'],
    },
  },
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm test -- --run --reporter=json
        env:
          CASHFREE_APP_ID: ${{ secrets.CASHFREE_APP_ID }}
          CASHFREE_SECRET_KEY: ${{ secrets.CASHFREE_SECRET_KEY }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results.json
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage
          path: coverage/
```

### Running in CI

```bash
# Ensure tests run without watch mode
npm test -- --run

# Generate coverage
npm test -- --run --coverage

# Exit with error code on failure
npm test -- --run || exit 1
```

---

## Performance Optimization

### Parallel Execution

Vitest automatically runs tests in parallel. You can configure worker threads:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    maxWorkers: 4, // Limit to 4 workers
    minWorkers: 2, // Minimum 2 workers
  },
});
```

### Slow Tests Investigation

Identify slow tests with the verbose reporter:

```bash
npm test -- --reporter=verbose --slowTestThreshold=100
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module"

```bash
# Clear Vitest cache
npm test -- --run --no-cache

# Or manually
rm -rf node_modules/.vitest
```

#### 2. Tests not found

Check `vitest.config.ts` include pattern:

```typescript
include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
```

#### 3. Mock not working

Ensure mock is set up before import:

```typescript
// WRONG - module already imported
import { myFunction } from '@/lib/module';
vi.mock('@/lib/module', () => ({ /* mock */ }));

// CORRECT - mock before import
vi.mock('@/lib/module', () => ({ /* mock */ }));
const { myFunction } = await import('@/lib/module');
```

#### 4. "Headers is not a constructor"

Use the provided Headers polyfill in `tests/setup.ts`:

```typescript
// Already configured in setup.ts
if (typeof global.Headers === 'undefined') {
  global.Headers = HeadersPolyfill as any;
}
```

#### 5. Test timeout

Increase timeout for slow tests:

```typescript
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

---

## Best Practices

### 1. Test Naming

Use descriptive test names that explain **what** is being tested:

```typescript
// BAD
it('test 1', () => { });
it('should work', () => { });

// GOOD
it('should return user when valid token is provided', () => { });
it('should throw error when payment ID is missing', () => { });
```

### 2. Test Organization

```typescript
describe('Module', () => {
  describe('Feature A', () => {
    it('should do X', () => { });
    it('should handle Y', () => { });
  });

  describe('Feature B', () => {
    it('should do Z', () => { });
  });
});
```

### 3. AAA Pattern

Follow the Arrange-Act-Assert pattern:

```typescript
it('should calculate total correctly', () => {
  // Arrange
  const cart = [{ price: 100 }, { price: 50 }];
  
  // Act
  const total = calculateTotal(cart);
  
  // Assert
  expect(total).toBe(150);
});
```

### 4. Keep Tests Independent

Each test should be able to run in isolation:

```typescript
// BAD - depends on previous test
let counter = 0;
it('increments counter', () => {
  counter++;
  expect(counter).toBe(1);
});
it('increments again', () => {
  counter++;
  expect(counter).toBe(2); // FAILS if run alone
});

// GOOD - independent
it('increments counter to 1', () => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

### 5. Avoid Testing Implementation Details

Test behavior, not implementation:

```typescript
// GOOD - tests behavior
it('should show error when email is invalid', () => {
  const result = validateEmail('invalid');
  expect(result.isValid).toBe(false);
  expect(result.error).toBe('Invalid email format');
});
```

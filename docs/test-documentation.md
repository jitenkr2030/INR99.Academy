# Test Suite Documentation

This document provides comprehensive documentation for the test suite implemented for the INR99 Academy application. The test suite includes unit tests and integration tests covering authentication, utilities, payment processing, and API endpoints.

## Table of Contents

1. [Test Structure Overview](#test-structure-overview)
2. [Unit Tests](#unit-tests)
   - [Utility Functions](#utility-functions)
   - [Authentication Module](#authentication-module)
   - [Cashfree Payment Service](#cashfree-payment-service)
3. [Integration Tests](#integration-tests)
   - [Payment Verification API](#payment-verification-api)
4. [Test Configuration](#test-configuration)
5. [Running Tests](#running-tests)
6. [Test Coverage Summary](#test-coverage-summary)

---

## Test Structure Overview

The test suite is organized in the following structure:

```
tests/
├── setup.ts                    # Global test configuration and mocks
├── fixtures/
│   └── test-data.ts           # Mock data for tests
├── unit/
│   ├── utils.test.ts          # Utility function tests
│   ├── auth.test.ts           # Authentication module tests
│   └── cashfree.test.ts       # Payment service tests
└── integration/
    └── payment-verify.test.ts # API integration tests
```

### Test Framework

- **Framework**: Vitest (v2.1.9)
- **Environment**: Node.js
- **Configuration**: `vitest.config.ts`

---

## Unit Tests

### Utility Functions

**File**: `tests/unit/utils.test.ts`

The utility function tests cover class name merging, validation helpers, currency formatting, date formatting, and slug generation.

#### Class Name Merging (`cn()`)

The `cn()` function combines Tailwind CSS class names using `clsx` and `twMerge`.

| Test Case | Description | Expected Behavior |
|-----------|-------------|-------------------|
| Merge simple class names | `cn('p-4', 'm-2')` | Returns `'p-4 m-2'` |
| Handle tailwind merge conflicts | `cn('p-4', 'p-2')` | Later class wins → `'p-2'` |
| Handle margin/padding conflicts | `cn('p-4 p-2', 'm-2 m-4')` | Resolves conflicts correctly |
| Handle conditional classes | `cn('base', isActive && 'active')` | Conditional classes included |
| Handle empty inputs | `cn()` | Returns empty string |
| Handle undefined/null | `cn('first', undefined, null, 'last')` | Filters out null/undefined |
| Handle array inputs | `cn(['p-4', 'm-2'], ['bg-blue-500'])` | Flattens arrays |
| Handle mixed object/array | `cn('base', ['array'], { 'cond': true })` | Handles complex inputs |
| Complex tailwind conflicts | `cn('text-lg', 'text-sm')` | Later class wins |
| Preserve non-conflicting | `cn('flex items', 'justify-between p-2')` | Non-conflicting preserved |
| Responsive prefixes | `cn('text-sm md:text-base', 'text-xl')` | Responsive classes work |
| Hover/focus states | `cn('bg-blue-500 hover:bg-blue-600')` | State classes preserved |
| Nested arrays | `cn([['a', 'b'], ['c', 'd']])` | Flattens nested arrays |
| Deeply nested logic | Complex conditional nesting | Resolves correctly |
| Long class strings | Very long class string | Preserves all classes |
| Duplicate classes | `cn('p-4', 'p-4', 'p-4')` | Deduplicates to single |
| Special characters | Tailwind arbitrary values | Preserves correctly |

#### Validation Helpers

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid email formats | `user@example.com`, `user.name@example.co.in` | `true` |
| Invalid email formats | `invalid-email`, `@example.com`, `user@` | `false` |
| Valid Indian phone numbers | `9876543210`, `9123456789` | `true` |
| Invalid phone numbers | `1234567890` (starts with 1), `987654321` (9 digits) | `false` |
| Valid URLs | `https://example.com`, `http://localhost:3000` | `true` |
| Invalid URLs | `not-a-url`, `http://` | `false` |

#### Currency Formatting (`formatINR()`)

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Positive amounts | `100`, `1000`, `100000` | `₹100`, `₹1,000`, `₹1,00,000` |
| Decimal amounts | `99.5`, `99.99` | `₹99.5`, `₹99.99` |
| Zero amount | `0` | `₹0` |
| Rounding | `99.999` | `₹100` |

**Note**: The function uses `Intl.NumberFormat` with `minimumFractionDigits: 0` for Indian Rupee formatting.

#### Date Formatting (`formatDate()`)

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Date objects | `new Date('2024-01-15')` | `'15 January 2024'` |
| Date strings | `'2024-01-15'` | `'15 January 2024'` |
| Invalid dates | `'invalid-date'` | `'Invalid Date'` |

#### Slug Generation (`generateSlug()`)

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Basic conversion | `'Hello World'` | `'hello-world'` |
| Multiple spaces | `'Test   Multiple   Spaces'` | `'test-multiple-spaces'` |
| Special characters | `'Test@#$%Special'` | `'testspecial'` |
| Empty string | `''` | `''` |
| Unicode characters | `'Héllo Wörld'` | `'hllo-wrld'` (accented chars removed) |

**Note**: The slug generation uses the regex `[^\w\s-]` which removes accented characters.

---

### Authentication Module

**File**: `tests/unit/auth.test.ts`

The authentication module tests cover token creation, user extraction, authorization checks, token security, and error handling.

#### Token Creation (`createAuthToken()`)

| Test Case | Description | Expected Behavior |
|-----------|-------------|-------------------|
| Valid user object | Create token from user | Returns base64 encoded string |
| Consistent tokens | Same user, multiple calls | Returns identical tokens |
| Required fields only | User with only `id` and `mobileNumber` | Token contains only those fields |
| All optional fields | User with email and name | All fields included in token |
| URL-safe tokens | Email with `+` special char | No spaces in token |
| Unicode names | User with unicode name | Correctly encoded/decoded |

#### User Extraction (`getAuthenticatedUser()`)

| Test Case | Header Value | Expected Result |
|-----------|--------------|-----------------|
| Missing authorization | No header | `null` |
| Non-Bearer token | `'Basic dXNlcjpwYXNz'` | `null` |
| Empty Bearer token | `'Bearer '` | `null` |
| Invalid base64 | `'Bearer !@#$%^&*()'` | `null` |
| Invalid JSON in token | `'Bearer bm90LWpzb24='` | `null` |
| Valid token | `'Bearer <base64_user_json>` | User object |
| Case-insensitive | `'bearer <token>'` | User object (fixed in code) |
| Complex token | Unicode chars, special emails | Correct user extracted |

#### Token Security

| Test Case | Description | Expected Behavior |
|-----------|-------------|-------------------|
| No sensitive exposure | Token is base64 JSON | Data is decodeable (not encrypted) |
| Unicode support | Hindi characters in name | Correctly preserved |
| Malformed header | Special chars in token | Returns `null`, no crash |
| Long tokens | 10,000 char metadata | Handles without crash |
| Empty user object | Empty id and mobile | Returns valid token |

#### Session Token Flow

| Test Case | Description | Expected Behavior |
|-----------|-------------|-------------------|
| Complete auth flow | Create → Request → Extract | Complete flow works |
| Auth vs unauth | Both request types | Correctly distinguishes |

---

### Cashfree Payment Service

**File**: `tests/unit/cashfree.test.ts`

The Cashfree payment service tests cover order creation, payment retrieval, verification, webhook signature validation, payment link generation, and available payment methods.

#### Constructor

| Test Case | Description | Expected Behavior |
|-----------|-------------|-------------------|
| Environment variables | Initialize with `process.env` | Service configured correctly |
| Default API URL | No `CASHFREE_API_URL` set | Uses default Cashfree URL |

#### Order Creation (`createOrder()`)

| Test Case | Mock Response | Expected Result |
|-----------|---------------|-----------------|
| Successful order | `{ order_id, payment_session_id, order_status }` | Returns order data |
| Required fields | Valid order parameters | All fields included in payload |
| Error response | `{ message: 'Invalid request' }` | Throws error |
| Network error | `Error: Network error` | Throws error |
| Correct headers | API request | Headers include `x-client-id`, `x-client-secret`, `x-api-version` |
| Default currency | No currency specified | Sets `order_currency: 'INR'` |
| Return URL | Order meta | Includes `return_url` with `{order_id}` placeholder |

#### Order Payments (`getOrderPayments()`)

| Test Case | Mock Response | Expected Result |
|-----------|---------------|-----------------|
| Multiple payments | `[ { cf_payment_id, transaction_status } ]` | Returns all payments |
| Empty list | `{ list: [] }` | Returns empty array |
| Fetch failure | `ok: false` | Throws error |
| Correct endpoint | Order ID | URL contains `/orders/{orderId}/payments` |

#### Payment Verification (`verifyPayment()`)

| Test Case | Mock Payments | Expected Result |
|-----------|---------------|-----------------|
| SUCCESS payment | `[ { transaction_status: 'SUCCESS' } ]` | `{ success: true, status: 'SUCCESS' }` |
| PENDING payment | `[ { transaction_status: 'PENDING' } ]` | `{ success: false, status: 'PENDING' }` |
| FAILED payment | `[ { transaction_status: 'FAILED', payment_message } ]` | `{ success: false, status: 'FAILED' }` |
| No payment found | `{ list: [] }` | `{ success: false, status: 'ERROR' }` |
| Priority: SUCCESS | Mixed statuses | Returns SUCCESS result |
| Priority: PENDING over FAILED | Both statuses | Returns PENDING result |
| API error | `Error: API Error` | Returns error response |

#### Webhook Signature Verification (`verifyWebhookSignature()`)

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Valid signature | Matching signature | `true` |
| Invalid signature | Non-matching signature | `false` |
| Verification error | `Error: Crypto error` | `false` |

#### Payment Link Generation (`generatePaymentLink()`)

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| Correct URL | Valid params | Contains `https://payments.cashfree.com/links` |
| Query parameters | Order params | All params in query string |
| URL encoding | `test+special@example.com` | Encoded as `test%2Bspecial%40example.com` |

#### Available Payment Methods

| Test Case | Expected Result |
|-----------|-----------------|
| All methods | `['UPI', 'CARD', 'NETBANKING', 'WALLET']` |

---

## Integration Tests

### Payment Verification API

**File**: `tests/integration/payment-verify.test.ts`

The integration tests cover the complete payment verification API endpoint including authentication, order verification, payment processing, subscription activation, and error handling.

#### Authentication

| Test Case | Mock Setup | Expected Response |
|-----------|------------|-------------------|
| Unauthenticated | `getServerSession: null`, `getAuthenticatedUser: null` | `401 Unauthorized` |
| NextAuth session | Session with user ID | Authenticated via session |
| Bearer token fallback | Token-based user | Authenticated via token |

#### WordPress License Order Verification

| Test Case | Mock Data | Expected Result |
|-----------|-----------|-----------------|
| Existing paid order | `paymentOrder.status: 'paid'`, `site` data | `200` with site credentials |
| New site order | `paymentOrder.status: 'pending'`, `site` without API key | `200` with generated API key/secret |
| Non-existent order | No order found | `404` error |

#### Regular Payment Verification

| Test Case | Mock Data | Expected Result |
|-----------|-----------|-----------------|
| Missing paymentId | No `paymentId` in body | `400` Bad Request |
| Missing paymentMethod | No `paymentMethod` in body | `400` Bad Request |
| Non-existent payment | No payment record | `404` error |
| Successful verification | Valid payment | `200` with updated payment |
| Monthly subscription | Amount ≥ 99, < 297 | Activates MONTHLY subscription |
| Quarterly subscription | Amount ≥ 297, < 1188 | Activates QUARTERLY subscription |
| Yearly subscription | Amount ≥ 1188 | Activates YEARLY subscription |
| Non-subscription | `type: 'ONE_TIME'` | No subscription activation |
| Database error | `Error: Database connection failed` | `500` Internal Server Error |
| Transaction metadata | Valid transaction | Metadata includes `txnId`, `verifiedAt`, `paymentMethod` |

#### Payment Verification Flow Tests

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Session authentication | First call with session | `200` OK |
| Token authentication | Second call with token | `200` OK |

---

## Test Configuration

### Setup File (`tests/setup.ts`)

The setup file configures:

1. **Environment Variables**: All required environment variables are set for tests
   - `NODE_ENV: 'test'`
   - `NEXT_PUBLIC_APP_URL: 'http://localhost:3000'`
   - `CASHFREE_*` credentials
   - `NEXTAUTH_*` settings
   - `AWS_*` settings

2. **Headers Polyfill**: A custom `HeadersPolyfill` class for Node.js environment
   - Implements `get()`, `set()`, `has()`, `delete()`, `append()`, `forEach()`
   - Handles case-insensitive header names

3. **Console Mocking**: Suppresses `console.log` and `console.info` during tests
   - Keeps `console.error` visible for debugging

4. **Global Fetch Mock**: `global.fetch` is mocked with `vi.fn()`

5. **Cleanup**: `afterEach` resets mocks and modules

### Vitest Configuration (`vitest.config.ts`)

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/unit/auth.test.ts

# Run in watch mode (development)
npm test -- --watch
```

### Test Output

The test suite produces output showing:
- Test file names and status
- Individual test cases with pass/fail status
- Execution time for each test
- Error messages for failed tests

---

## Test Coverage Summary

| Test File | Tests | Passing | Coverage |
|-----------|-------|---------|----------|
| `tests/unit/utils.test.ts` | 34 | 34 | Core utilities, validation, formatting |
| `tests/unit/auth.test.ts` | 24 | 24 | Token creation, user extraction, auth flow |
| `tests/unit/cashfree.test.ts` | 28 | 28 | Payment service, orders, verification, webhooks |
| `tests/integration/payment-verify.test.ts` | 17 | 17 | API endpoint, authentication, payment flow |
| **Total** | **103** | **103** | **100% passing** |

### Coverage Areas

- **Authentication**: Token creation/extraction, authorization checks, session handling
- **Utilities**: Class merging, validation, currency/date formatting, slug generation
- **Payments**: Order creation, verification, webhook signatures, payment links
- **API Integration**: End-to-end payment verification flow with mocked dependencies

---

## Best Practices Implemented

1. **Isolation**: Each test uses fresh mocks via `beforeEach` and `vi.clearAllMocks()`
2. **Descriptive Names**: Test names clearly describe what is being tested
3. **Edge Cases**: Tests cover empty inputs, invalid data, error conditions
4. **Mocking**: External dependencies (database, APIs, auth) are properly mocked
5. **Documentation**: Each test suite has descriptive comments

---

## Future Enhancements

Potential areas for additional test coverage:

1. **Load Testing**: Using tools like `autocannon` or `k6`
2. **E2E Testing**: With Playwright or Cypress
3. **Security Tests**: Auth bypass, injection prevention
4. **Database Integration Tests**: With test database
5. **Error Boundary Tests**: React component error boundaries

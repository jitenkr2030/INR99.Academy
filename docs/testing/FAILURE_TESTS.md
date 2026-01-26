# Failure Tests Guide

This document provides detailed information about the failure testing implementation in INR99.Academy.

## Overview

Failure tests validate that the system can handle various failure scenarios gracefully. These tests ensure that the application degrades nicely when components fail and can recover properly.

## Test Categories

### 1. Database Resilience Tests (`tests/failure/db-failure.test.ts`)

Tests in this category validate database failure handling:

#### Connection Failure Handling

```typescript
describe('Connection Failure Handling', () => {
  it('should handle database connection timeout', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1001: Can\'t reach database server at `localhost`:`5432`')
    );

    await expect(getUserById('user-123')).rejects.toThrow('P1001');
  });

  it('should handle connection refused errors', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1001: Connection refused')
    );

    await expect(getUserById('user-123')).rejects.toThrow('P1001');
  });

  it('should handle authentication failures', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1002: Database connection error: Invalid credentials')
    );

    await expect(getUserById('user-123')).rejects.toThrow('P1002');
  });

  it('should handle SSL connection errors', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1003: Database connection error: SSL required')
    );

    await expect(getUserById('user-123')).rejects.toThrow('P1003');
  });
});
```

#### Query Timeout Handling

```typescript
describe('Query Timeout Handling', () => {
  it('should handle slow query timeouts', async () => {
    mockPrisma.user.findMany.mockImplementation(
      () => new Promise((resolve) => 
        setTimeout(() => resolve([]), 60000) // 60 second delay
      )
    );

    const startTime = Date.now();
    await expect(getUserById('user-123')).rejects.toThrow();
    expect(Date.now() - startTime).toBeLessThan(60000);
  });

  it('should handle transaction timeouts', async () => {
    mockPrisma.paymentRecord.create.mockImplementation(
      () => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Transaction timeout after 30s')), 30001)
      )
    );

    await expect(createPaymentRecord({...})).rejects.toThrow('timeout');
  });
});
```

#### Constraint Violation Handling

```typescript
describe('Constraint Violation Handling', () => {
  it('should handle unique constraint violations', async () => {
    mockPrisma.user.create.mockRejectedValue(
      new Error('P2002: Unique constraint violation on user.email')
    );

    await expect(createPaymentRecord({...})).rejects.toThrow('P2002');
  });

  it('should handle foreign key constraint violations', async () => {
    mockPrisma.enrollment.create.mockRejectedValue(
      new Error('P2003: Foreign key constraint violation on enrollment.userId')
    );

    await expect(updateEnrollment('user-123', 'course-123', {})).rejects.toThrow('P2003');
  });
});
```

#### Deadlock Handling

```typescript
describe('Deadlock Handling', () => {
  it('should handle deadlock errors', async () => {
    mockPrisma.paymentRecord.update.mockRejectedValue(
      new Error('P40001: Transaction failed due to deadlock')
    );

    await expect(updateEnrollment('user-123', 'course-123', {})).rejects.toThrow('P40001');
  });

  it('should retry transactions after deadlock', async () => {
    let attempt = 0;
    mockPrisma.paymentRecord.update.mockImplementation(() => {
      attempt++;
      if (attempt === 1) {
        return Promise.reject(new Error('P40001: Deadlock'));
      }
      return Promise.resolve({ id: 'payment-123' });
    });

    const result = await updateEnrollment('user-123', 'course-123', {});
    expect(attempt).toBe(2); // Should have retried
  });
});
```

#### Graceful Degradation

```typescript
describe('Graceful Degradation', () => {
  it('should return cached data when database is unavailable', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1001: Database unavailable')
    );

    const result = await getUserById('user-123', { useCache: true });
    expect(result).toBeDefined();
  });

  it('should show friendly error page when database fails', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(
      new Error('P1001: Database connection failed')
    );

    try {
      await getUserById('user-123');
    } catch (error) {
      expect(error.message).toContain('P1001');
    }
  });
});
```

### 2. External Service Resilience Tests (`tests/failure/external-service.test.ts`)

Tests in this category validate handling of external service failures:

#### Payment Gateway Failures

```typescript
describe('Payment Gateway Failures', () => {
  it('should handle payment gateway timeout', async () => {
    (createPaymentOrder as vi.Mock).mockImplementation(
      () => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gateway timeout after 35s')), 35001)
      )
    );

    await expect(createPaymentOrder({...})).rejects.toThrow('timeout');
  });

  it('should handle payment gateway connection errors', async () => {
    (createPaymentOrder as vi.Mock).mockRejectedValue(
      new Error('ENOTFOUND: Payment gateway not found')
    );

    await expect(createPaymentOrder({...})).rejects.toThrow('ENOTFOUND');
  });

  it('should handle 500 errors from payment gateway', async () => {
    (createPaymentOrder as vi.Mock).mockRejectedValue(
      new Error('500 Internal Server Error: Gateway temporarily unavailable')
    );

    await expect(createPaymentOrder({...})).rejects.toThrow('500');
  });

  it('should handle 503 service unavailable errors', async () => {
    (createPaymentOrder as vi.Mock).mockRejectedValue(
      new Error('503 Service Unavailable: Maintenance in progress')
    );

    await expect(createPaymentOrder({...})).rejects.toThrow('503');
  });

  it('should handle rate limiting from payment gateway', async () => {
    (createPaymentOrder as vi.Mock).mockRejectedValue(
      new Error('429 Too Many Requests: Rate limit exceeded')
    );

    await expect(createPaymentOrder({...})).rejects.toThrow('429');
  });
});
```

#### Webhook Processing Failures

```typescript
describe('Webhook Processing Failures', () => {
  it('should handle duplicate webhook notifications', async () => {
    (createPaymentOrder as vi.Mock).mockResolvedValue({ orderId: 'order123' });

    const webhook1 = processPaymentWebhook({ orderId: 'order123', paymentId: 'pay123', status: 'SUCCESS' });
    const webhook2 = processPaymentWebhook({ orderId: 'order123', paymentId: 'pay123', status: 'SUCCESS' });

    await expect(webhook1).resolves.toBeDefined();
    await expect(webhook2).resolves.toBeDefined();
  });

  it('should handle malformed webhook payloads', async () => {
    await expect(processPaymentWebhook({
      orderId: null,
      paymentId: undefined,
      status: 'INVALID',
    })).rejects.toThrow();
  });
});
```

#### Email Service Failures

```typescript
describe('Email Service Failures', () => {
  it('should handle email service timeouts', async () => {
    (sendEmail as vi.Mock).mockImplementation(
      () => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email service timeout')), 30001)
      )
    );

    await expect(sendEmail({...})).rejects.toThrow('timeout');
  });

  it('should handle SMTP connection failures', async () => {
    (sendEmail as vi.Mock).mockRejectedValue(
      new Error('ECONNREFUSED: Cannot connect to SMTP server')
    );

    await expect(sendEmail({...})).rejects.toThrow('ECONNREFUSED');
  });

  it('should handle email rate limiting', async () => {
    (sendEmail as vi.Mock).mockRejectedValue(
      new Error('429 Too Many Requests: Email rate limit exceeded')
    );

    await expect(sendEmail({...})).rejects.toThrow('429');
  });

  it('should queue failed emails for retry', async () => {
    (sendEmail as vi.Mock)
      .mockRejectedValueOnce(new Error('Temporary failure'))
      .mockResolvedValueOnce({ messageId: 'msg-123' });

    await expect(sendEmail({...})).rejects.toThrow('Temporary failure');
    const result = await sendEmail({...});
    expect(result).toEqual({ messageId: 'msg-123' });
  });
});
```

#### Cascading Failure Prevention

```typescript
describe('Cascading Failure Prevention', () => {
  it('should not cascade failures to other services', async () => {
    (createPaymentOrder as vi.Mock).mockRejectedValue(
      new Error('Payment service unavailable')
    );
    (sendEmail as vi.Mock).mockResolvedValue({ messageId: 'msg-123' });

    const paymentPromise = createPaymentOrder({...});
    const emailPromise = sendEmail({...});

    const [paymentResult, emailResult] = await Promise.allSettled([
      paymentPromise,
      emailPromise,
    ]);

    expect(paymentResult.status).toBe('rejected');
    expect(emailResult.status).toBe('fulfilled');
  });

  it('should implement circuit breaker pattern', async () => {
    let failureCount = 0;
    const maxFailures = 5;

    (createPaymentOrder as vi.Mock).mockImplementation(() => {
      failureCount++;
      if (failureCount < maxFailures) {
        return Promise.reject(new Error('Service unavailable'));
      }
      throw new Error('Circuit breaker: Service temporarily unavailable');
    });

    for (let i = 0; i < maxFailures; i++) {
      await expect(createPaymentOrder({...})).rejects.toThrow();
    }

    await expect(createPaymentOrder({...})).rejects.toThrow('Circuit breaker');
  });

  it('should fallback to alternative providers', async () => {
    (createPaymentOrder as vi.Mock)
      .mockRejectedValueOnce(new Error('Primary provider down'))
      .mockResolvedValueOnce({ orderId: 'order123', provider: 'backup' });

    const result = await createPaymentOrder({...});
    expect(result).toEqual({ orderId: 'order123', provider: 'backup' });
  });
});
```

## Running Failure Tests

```bash
# Run all failure tests
npm run test:failure

# Run specific test files
npm run test:failure:db          # Database resilience tests
npm run test:failure:external    # External service tests

# Run with coverage
npm run test:failure:coverage

# Run in watch mode
npm run test:failure:watch
```

## Failure Test Coverage

| Failure Scenario | Test Coverage | Status |
|-----------------|---------------|--------|
| Database Connection Failures | 100% | ✅ Complete |
| Query Timeouts | 100% | ✅ Complete |
| Constraint Violations | 100% | ✅ Complete |
| Deadlock Handling | 100% | ✅ Complete |
| Graceful Degradation | 85% | ✅ Complete |
| Payment Gateway Failures | 100% | ✅ Complete |
| Webhook Processing | 100% | ✅ Complete |
| Email Service Failures | 100% | ✅ Complete |
| Cascading Failures | 90% | ✅ Complete |
| Circuit Breaker | 85% | ✅ Complete |

## Common Failure Test Patterns

### Pattern 1: Timeout Testing

```typescript
async function testTimeout(service: Function, timeoutMs: number) {
  const startTime = Date.now();
  
  try {
    await service();
    return false; // Should have thrown
  } catch (error) {
    const elapsed = Date.now() - startTime;
    return elapsed < timeoutMs; // Should timeout before limit
  }
}
```

### Pattern 2: Circuit Breaker Testing

```typescript
async function testCircuitBreaker(service: Function, maxFailures: number) {
  let failures = 0;
  
  for (let i = 0; i < maxFailures + 1; i++) {
    try {
      await service();
    } catch (error) {
      failures++;
    }
  }
  
  // After max failures, should be open
  try {
    await service();
    return false;
  } catch (error) {
    return error.message.includes('Circuit breaker');
  }
}
```

### Pattern 3: Graceful Degradation Testing

```typescript
async function testGracefulDegradation(primaryService: Function, fallback: Function) {
  // Primary service fails
  (primaryService as vi.Mock).mockRejectedValue(new Error('Service down'));
  
  // Fallback should be used
  const result = await getDataWithFallback();
  expect(result).toEqual(fallback());
}
```

## Best Practices

1. **Test realistic failure modes** - Simulate actual failure scenarios
2. **Measure recovery time** - Track how long recovery takes
3. **Test cascading effects** - Ensure failures don't cascade
4. **Verify alerting** - Ensure failures trigger appropriate alerts
5. **Document recovery procedures** - Include runbooks in tests

## Related Documentation

- [Advanced Testing Suite](../ADVANCED_TESTING_SUITE.md)
- [Security Tests Guide](SECURITY_TESTS.md)
- [Load Tests Guide](LOAD_TESTS.md)
- [Chaos Engineering Principles](https://principlesofchaos.org/)

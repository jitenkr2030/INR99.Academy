# Testing Documentation

This directory contains comprehensive documentation for the INR99.Academy testing suite.

## Documentation Structure

```
docs/testing/
├── README.md                    # This file - Index
├── ADVANCED_TESTING_SUITE.md    # Comprehensive testing guide
├── SECURITY_TESTS.md            # Security testing detailed guide
├── FAILURE_TESTS.md             # Failure testing detailed guide
├── LOAD_TESTS.md                # Load testing detailed guide
└── TEST_RUNNER_REFERENCE.md     # Commands and configuration reference
```

## Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:security    # Security tests
npm run test:failure     # Failure tests
npm run test:load        # Load tests (requires k6)

# Run with coverage
npm run test:coverage
```

### Test Categories

1. **Unit Tests** (`tests/unit/`)
   - Core business logic validation
   - Utility function testing
   - Fast and isolated

2. **Integration Tests** (`tests/integration/`)
   - API endpoint testing
   - Database integration
   - Service interactions

3. **Security Tests** (`tests/security/`)
   - Authentication & Authorization
   - Input Validation
   - Rate Limiting

4. **Failure Tests** (`tests/failure/`)
   - Database Resilience
   - External Service Resilience

5. **Load Tests** (`tests/load/`)
   - Authentication Stress (k6)
   - Payment Processing (k6)
   - API Performance (k6)

## Documentation Links

- [Advanced Testing Suite](ADVANCED_TESTING_SUITE.md) - Complete testing overview
- [Security Tests Guide](SECURITY_TESTS.md) - Security testing patterns
- [Failure Tests Guide](FAILURE_TESTS.md) - Resilience testing patterns
- [Load Tests Guide](LOAD_TESTS.md) - Performance testing patterns
- [Test Runner Reference](TEST_RUNNER_REFERENCE.md) - Commands and configuration

## CI/CD Integration

Tests are automatically run in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Security Tests
  run: npm run test:security

- name: Run Failure Tests
  run: npm run test:failure

- name: Run Load Tests
  run: k6 run tests/load/auth-stress.js
```

## Support

For questions or issues:
- Review the detailed documentation files
- Check the troubleshooting section in each guide
- Contact the development team

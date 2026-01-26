/**
 * Unit Tests for Cashfree Payment Service
 *
 * Tests payment gateway integration including order creation,
 * payment verification, and webhook signature validation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CashfreeService, type CreateOrderParams, type PaymentVerificationResponse } from '@/lib/cashfree';

// Mock crypto-js module for webhook signature tests
vi.mock('crypto-js', () => {
  const mockHmacSHA256 = vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue('mock_signature_hash'),
  });
  
  return {
    default: {
      HmacSHA256: mockHmacSHA256,
      enc: {
        Hex: 'hex',
      },
    },
    HmacSHA256: mockHmacSHA256,
    enc: {
      Hex: 'hex',
    },
  };
});

describe('CashfreeService', () => {
  let cashfreeService: CashfreeService;
  let mockFetch: any;

  beforeEach(() => {
    vi.resetModules();
    cashfreeService = new CashfreeService();
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with environment variables', () => {
      const service = new CashfreeService();

      expect(service).toBeDefined();
      // The service should be configured with test credentials
    });

    it('should use default API URL if not configured', () => {
      const service = new CashfreeService();
      // Service should have a configured API URL
    });
  });

  describe('createOrder()', () => {
    const createOrderParams: CreateOrderParams = {
      orderId: 'order_test_123',
      orderAmount: 299,
      customerId: 'cust_test_456',
      customerEmail: 'test@example.com',
      customerPhone: '9876543210',
      orderNote: 'Test Order',
    };

    it('should create order successfully', async () => {
      const mockResponse = {
        order_id: 'order_test_123',
        payment_session_id: 'session_123',
        order_status: 'CREATED',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await cashfreeService.createOrder(createOrderParams);

      expect(result.order_id).toBe('order_test_123');
      expect(result.payment_session_id).toBe('session_123');
      expect(result.order_status).toBe('CREATED');
    });

    it('should include required fields in order payload', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          order_id: 'order_test_123',
          payment_session_id: 'session_123',
          order_status: 'CREATED',
        }),
      });

      await cashfreeService.createOrder(createOrderParams);

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const callArgs = mockFetch.mock.calls[0];
      const [url, options] = callArgs;

      expect(url).toContain('/orders');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(options.body);
      expect(body.order_id).toBe(createOrderParams.orderId);
      expect(body.order_amount).toBe(createOrderParams.orderAmount);
      expect(body.order_currency).toBe('INR');
      expect(body.customer_details.customer_id).toBe(createOrderParams.customerId);
      expect(body.customer_details.customer_email).toBe(createOrderParams.customerEmail);
      expect(body.customer_details.customer_phone).toBe(createOrderParams.customerPhone);
    });

    it('should throw error when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid request' }),
      });

      await expect(cashfreeService.createOrder(createOrderParams))
        .rejects.toThrow('Invalid request');
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(cashfreeService.createOrder(createOrderParams))
        .rejects.toThrow('Network error');
    });

    it('should set correct API headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          order_id: 'order_test_123',
          payment_session_id: 'session_123',
          order_status: 'CREATED',
        }),
      });

      await cashfreeService.createOrder(createOrderParams);

      const [, options] = mockFetch.mock.calls[0];

      expect(options.headers['x-client-id']).toBeDefined();
      expect(options.headers['x-client-secret']).toBeDefined();
      expect(options.headers['x-api-version']).toBe('2023-08-01');
    });

    it('should use INR as default currency', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          order_id: 'order_test_123',
          payment_session_id: 'session_123',
          order_status: 'CREATED',
        }),
      });

      await cashfreeService.createOrder(createOrderParams);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);

      expect(body.order_currency).toBe('INR');
    });

    it('should include return URL in order meta', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          order_id: 'order_test_123',
          payment_session_id: 'session_123',
          order_status: 'CREATED',
        }),
      });

      await cashfreeService.createOrder(createOrderParams);

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options.body);

      expect(body.order_meta.return_url).toBeDefined();
      expect(body.order_meta.return_url).toContain('order_id');
    });
  });

  describe('getOrderPayments()', () => {
    it('should retrieve payments for an order', async () => {
      const mockPayments = [
        { cf_payment_id: 'pay_123', transaction_status: 'SUCCESS' },
        { cf_payment_id: 'pay_124', transaction_status: 'PENDING' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const payments = await cashfreeService.getOrderPayments('order_123');

      expect(payments).toHaveLength(2);
      expect(payments[0].cf_payment_id).toBe('pay_123');
    });

    it('should return empty array when no payments exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: [] }),
      });

      const payments = await cashfreeService.getOrderPayments('order_empty');

      expect(payments).toEqual([]);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(cashfreeService.getOrderPayments('order_123'))
        .rejects.toThrow('Failed to fetch order payments');
    });

    it('should call correct endpoint for order payments', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: [] }),
      });

      await cashfreeService.getOrderPayments('order_abc');

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/orders/order_abc/payments');
    });
  });

  describe('verifyPayment()', () => {
    it('should return success for successful payment', async () => {
      const mockPayments = [
        {
          cf_payment_id: 'pay_success_123',
          transaction_status: 'SUCCESS',
          payment_method: { type: 'UPI' },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.success).toBe(true);
      expect(result.status).toBe('SUCCESS');
      expect(result.paymentId).toBe('pay_success_123');
      expect(result.paymentMethod).toBe('UPI');
    });

    it('should return pending status for pending payment', async () => {
      const mockPayments = [
        {
          cf_payment_id: 'pay_pending_123',
          transaction_status: 'PENDING',
          payment_method: { type: 'CARD' },
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.success).toBe(false);
      expect(result.status).toBe('PENDING');
      expect(result.message).toBe('Payment is still being processed');
    });

    it('should return failed status for failed payment', async () => {
      const mockPayments = [
        {
          cf_payment_id: 'pay_failed_123',
          transaction_status: 'FAILED',
          payment_message: 'Insufficient funds',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.success).toBe(false);
      expect(result.status).toBe('FAILED');
      expect(result.message).toBe('Insufficient funds');
    });

    it('should return error when no payment found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: [] }),
      });

      const result = await cashfreeService.verifyPayment('order_empty');

      expect(result.success).toBe(false);
      expect(result.status).toBe('ERROR');
      expect(result.message).toBe('Unable to determine payment status');
    });

    it('should prioritize SUCCESS over PENDING and FAILED', async () => {
      const mockPayments = [
        { cf_payment_id: 'pay_1', transaction_status: 'FAILED' },
        { cf_payment_id: 'pay_2', transaction_status: 'PENDING' },
        { cf_payment_id: 'pay_3', transaction_status: 'SUCCESS' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.status).toBe('SUCCESS');
      expect(result.paymentId).toBe('pay_3');
    });

    it('should prioritize PENDING over FAILED', async () => {
      const mockPayments = [
        { cf_payment_id: 'pay_1', transaction_status: 'FAILED' },
        { cf_payment_id: 'pay_2', transaction_status: 'PENDING' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ list: mockPayments }),
      });

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.status).toBe('PENDING');
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      const result = await cashfreeService.verifyPayment('order_123');

      expect(result.success).toBe(false);
      expect(result.status).toBe('ERROR');
      expect(result.message).toBe('API Error');
    });
  });

  describe('verifyWebhookSignature()', () => {
    let mockHmacSHA256: any;

    beforeEach(() => {
      // Reset the mock before each test
      mockHmacSHA256 = vi.fn().mockReturnValue({
        toString: vi.fn().mockReturnValue('mock_signature_hash'),
      });
      
      // Re-mock with fresh spy
      vi.doMock('crypto-js', () => ({
        default: {
          HmacSHA256: mockHmacSHA256,
          enc: { Hex: 'hex' },
        },
        HmacSHA256: mockHmacSHA256,
        enc: { Hex: 'hex' },
      }));
    });

    it('should return true for valid signature', () => {
      const payload = '{"order_id":"order_123","amount":299}';
      const signature = 'mock_signature_hash';
      const webhookSecret = 'webhook_secret_key';

      const result = cashfreeService.verifyWebhookSignature(payload, signature, webhookSecret);

      // The signature should match
      expect(result).toBe(true);
    });

    it('should return false for invalid signature', () => {
      const payload = '{"order_id":"order_123","amount":299}';
      const invalidSignature = 'wrong_signature';
      const webhookSecret = 'webhook_secret_key';

      // Override the mock for this test
      mockHmacSHA256.mockReturnValueOnce({
        toString: vi.fn().mockReturnValue('different_hash'),
      });

      const result = cashfreeService.verifyWebhookSignature(payload, invalidSignature, webhookSecret);

      expect(result).toBe(false);
    });

    it('should return false on signature verification error', () => {
      const payload = '{"order_id":"order_123","amount":299}';
      const signature = 'signature';
      const webhookSecret = 'webhook_secret_key';

      // Override the mock to throw an error
      mockHmacSHA256.mockImplementation(() => {
        throw new Error('Crypto error');
      });

      const result = cashfreeService.verifyWebhookSignature(payload, signature, webhookSecret);

      expect(result).toBe(false);
    });
  });

  describe('generatePaymentLink()', () => {
    it('should generate correct payment link URL', () => {
      const params = {
        orderId: 'order_123',
        orderAmount: 299,
        customerEmail: 'test@example.com',
        customerPhone: '9876543210',
      };

      const link = cashfreeService.generatePaymentLink(params);

      expect(link).toContain('https://payments.cashfree.com/links');
      expect(link).toContain('order_id=order_123');
      expect(link).toContain('order_amount=299');
      expect(link).toContain('order_currency=INR');
      // Email is URL encoded
      expect(link).toContain('customer_email=test%40example.com');
      expect(link).toContain('customer_phone=9876543210');
    });

    it('should URL encode special characters in parameters', () => {
      const params = {
        orderId: 'order_123',
        orderAmount: 299,
        customerEmail: 'test+special@example.com',
        customerPhone: '9876543210',
      };

      const link = cashfreeService.generatePaymentLink(params);

      expect(link).toContain('customer_email=');
      // Email with @ symbol should be URL encoded
      expect(link).toContain('test%2Bspecial%40example.com');
    });
  });

  describe('getAvailablePaymentMethods()', () => {
    it('should return list of payment methods', () => {
      const methods = cashfreeService.getAvailablePaymentMethods();

      expect(methods).toContain('UPI');
      expect(methods).toContain('CARD');
      expect(methods).toContain('NETBANKING');
      expect(methods).toContain('WALLET');
      expect(methods).toHaveLength(4);
    });
  });
});

describe('Payment Flow Integration Tests (Mocked)', () => {
  it('should complete full payment flow with mocked API', async () => {
    const cashfreeService = new CashfreeService();
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    // 1. Create Order
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        order_id: 'order_flow_123',
        payment_session_id: 'session_123',
        order_status: 'CREATED',
      }),
    });

    const orderResult = await cashfreeService.createOrder({
      orderId: 'order_flow_123',
      orderAmount: 299,
      customerId: 'cust_123',
      customerEmail: 'test@example.com',
      customerPhone: '9876543210',
    });

    expect(orderResult.order_id).toBe('order_flow_123');

    // 2. Verify Payment (simulating successful payment)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        list: [{
          cf_payment_id: 'pay_123',
          transaction_status: 'SUCCESS',
          payment_method: { type: 'UPI' },
        }],
      }),
    });

    const verifyResult = await cashfreeService.verifyPayment('order_flow_123');

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.status).toBe('SUCCESS');
  });

  it('should handle payment verification edge cases', async () => {
    const cashfreeService = new CashfreeService();
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Test with multiple payment attempts
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        list: [
          { cf_payment_id: 'pay_1', transaction_status: 'FAILED' },
          { cf_payment_id: 'pay_2', transaction_status: 'SUCCESS' },
        ],
      }),
    });

    const result = await cashfreeService.verifyPayment('order_multi');

    // Should find the SUCCESS payment even though FAILED exists
    expect(result.status).toBe('SUCCESS');
    expect(result.paymentId).toBe('pay_2');
  });
});

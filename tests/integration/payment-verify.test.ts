/**
 * Integration Tests for Payment Verification API
 *
 * Tests the complete payment verification flow including
 * authentication, database operations, and response handling.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/payments/verify/route';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Helper to create mock NextRequest - defined at top level for access in all tests
function createMockRequest(body: Record<string, unknown> = {}): NextRequest {
  const mockHeaders = new Map<string, string>();
  return {
    json: () => Promise.resolve(body),
    headers: {
      get: (name: string) => mockHeaders.get(name.toLowerCase()) || null,
      has: (name: string) => mockHeaders.has(name.toLowerCase()),
      set: (name: string, value: string) => mockHeaders.set(name.toLowerCase(), value),
    },
    method: 'POST',
    nextUrl: new URL('http://localhost:3000/api/payments/verify'),
  } as unknown as NextRequest;
}

// Mock dependencies
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  authOptions: {
    session: { strategy: 'jwt' },
    providers: [],
  },
}));

vi.mock('@/lib/db', () => ({
  db: {
    paymentOrders: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    paymentRecord: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    wpSites: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    subscription: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('crypto');
  return {
    ...actual,
    default: {
      ...actual,
      randomBytes: vi.fn().mockReturnValue(Buffer.from('a'.repeat(64))),
    },
    randomBytes: vi.fn().mockReturnValue(Buffer.from('a'.repeat(64))),
  };
});

import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';

describe('Payment Verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 when user is not authenticated', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);
      (getAuthenticatedUser as vi.Mock).mockReturnValue(null);

      const request = createMockRequest({
        paymentId: 'pay_123',
        paymentMethod: 'UPI',
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe('Unauthorized');
    });

    it('should authenticate via NextAuth session', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_session_123' },
      });
      (getAuthenticatedUser as vi.Mock).mockReturnValue(null);

      const request = createMockRequest({});
      await POST(request);

      expect(getServerSession).toHaveBeenCalled();
    });

    it('should authenticate via Bearer token fallback', async () => {
      (getServerSession as vi.Mock).mockResolvedValue(null);
      (getAuthenticatedUser as vi.Mock).mockReturnValue({ id: 'user_token_123' });

      const request = createMockRequest({});
      await POST(request);

      expect(getAuthenticatedUser).toHaveBeenCalled();
    });
  });

  describe('WordPress License Order Verification', () => {
    it('should return existing site credentials if already paid', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockSite = {
        id: 'site_123',
        siteName: 'Test Site',
        siteUrl: 'https://test.example.com',
        apiKey: 'mock_api_key',
        apiSecret: 'mock_api_secret',
        licenseTier: 'professional',
      };

      db.paymentOrders.findFirst.mockResolvedValue({
        id: 'order_123',
        orderId: 'wp_order_123',
        status: 'paid',
        metadata: { siteId: 'site_123' },
      });

      db.wpSites.findUnique.mockResolvedValue(mockSite);

      const request = createMockRequest({ orderId: 'wp_order_123' });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.siteId).toBe('site_123');
      expect(body.data.apiKey).toBe('mock_api_key');
    });

    it('should generate credentials for new WordPress site order', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      db.paymentOrders.findFirst.mockResolvedValue({
        id: 'order_123',
        orderId: 'wp_order_new',
        status: 'pending',
        metadata: { siteId: 'site_new', billingCycle: 'monthly' },
      });

      db.wpSites.findUnique.mockResolvedValue({
        id: 'site_new',
        siteName: 'New Site',
        siteUrl: 'https://new.example.com',
        licenseTier: 'basic',
      });

      db.wpSites.update.mockResolvedValue({});
      db.paymentOrders.update.mockResolvedValue({});

      const request = createMockRequest({ orderId: 'wp_order_new' });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.data.apiKey).toBeDefined();
      expect(body.data.apiSecret).toBeDefined();
    });

    it('should return 404 for non-existent order', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      db.paymentOrders.findFirst.mockResolvedValue(null);

      const request = createMockRequest({ orderId: 'nonexistent_order' });
      const response = await POST(request);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Order not found');
    });
  });

  describe('Regular Payment Verification', () => {
    it('should return 400 when paymentId is missing', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const request = createMockRequest({
        paymentMethod: 'UPI',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Payment ID and method are required');
    });

    it('should return 400 when paymentMethod is missing', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const request = createMockRequest({
        paymentId: 'pay_123',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe('Payment ID and method are required');
    });

    it('should return 404 for non-existent payment record', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      db.paymentRecord.findFirst.mockResolvedValue(null);

      const request = createMockRequest({
        paymentId: 'pay_nonexistent',
        paymentMethod: 'UPI',
        transactionId: 'txn_123',
      });

      const response = await POST(request);

      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.error).toBe('Payment not found or already processed');
    });

    it('should complete payment verification successfully', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_123',
        status: 'PENDING',
        amount: 99,
        type: 'SUBSCRIPTION',
        metadata: '{}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue({
        ...mockPayment,
        status: 'COMPLETED',
      });
      db.subscription.upsert.mockResolvedValue({});

      const request = createMockRequest({
        paymentId: 'pay_123',
        paymentMethod: 'UPI',
        transactionId: 'txn_123',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.payment.status).toBe('COMPLETED');
    });

    it('should activate monthly subscription for payments >= 99', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_monthly',
        status: 'PENDING',
        amount: 99,
        type: 'SUBSCRIPTION',
        metadata: '{}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue(mockPayment);
      db.subscription.upsert.mockResolvedValue({});

      const request = createMockRequest({
        paymentId: 'pay_monthly',
        paymentMethod: 'CARD',
        transactionId: 'txn_monthly',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(db.subscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId_type: expect.objectContaining({
              userId: 'user_123',
              type: 'MONTHLY',
            }),
          }),
        })
      );
    });

    it('should activate quarterly subscription for payments >= 297', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_quarterly',
        status: 'PENDING',
        amount: 297,
        type: 'SUBSCRIPTION',
        metadata: '{}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue(mockPayment);
      db.subscription.upsert.mockResolvedValue({});

      const request = createMockRequest({
        paymentId: 'pay_quarterly',
        paymentMethod: 'NETBANKING',
        transactionId: 'txn_quarterly',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(db.subscription.upsert).toHaveBeenCalled();
    });

    it('should activate yearly subscription for payments >= 1188', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_yearly',
        status: 'PENDING',
        amount: 1188,
        type: 'SUBSCRIPTION',
        metadata: '{}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue(mockPayment);
      db.subscription.upsert.mockResolvedValue({});

      const request = createMockRequest({
        paymentId: 'pay_yearly',
        paymentMethod: 'UPI',
        transactionId: 'txn_yearly',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(db.subscription.upsert).toHaveBeenCalled();
    });

    it('should handle non-subscription payments without subscription activation', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_onetime',
        status: 'PENDING',
        amount: 499,
        type: 'ONE_TIME',
        metadata: '{}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue(mockPayment);

      const request = createMockRequest({
        paymentId: 'pay_onetime',
        paymentMethod: 'CARD',
        transactionId: 'txn_onetime',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      // Should not call subscription upsert for non-subscription payments
      expect(db.subscription.upsert).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      db.paymentRecord.findFirst.mockRejectedValue(new Error('Database connection failed'));

      const request = createMockRequest({
        paymentId: 'pay_123',
        paymentMethod: 'UPI',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe('Internal server error');
    });

    it('should include transaction details in payment metadata', async () => {
      (getServerSession as vi.Mock).mockResolvedValue({
        user: { id: 'user_123' },
      });

      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_metadata',
        status: 'PENDING',
        amount: 199,
        type: 'ONE_TIME',
        metadata: '{"courseId": "course_123"}',
      };

      db.paymentRecord.findFirst.mockResolvedValue(mockPayment);
      db.paymentRecord.update.mockResolvedValue({});

      const request = createMockRequest({
        paymentId: 'pay_metadata',
        paymentMethod: 'UPI',
        transactionId: 'txn_metadata_123',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);

      expect(db.paymentRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'payment_record_123' },
          data: expect.objectContaining({
            metadata: expect.stringContaining('txn_metadata_123'),
            metadata: expect.stringContaining('verifiedAt'),
            metadata: expect.stringContaining('UPI'),
          }),
        })
      );
    });
  });

  describe('Payment Verification Flow Tests', () => {
    it('should handle complete payment verification flow with both auth methods', async () => {
      const mockPayment = {
        id: 'payment_record_123',
        userId: 'user_123',
        paymentId: 'pay_flow_test',
        status: 'PENDING',
        amount: 299,
        type: 'ONE_TIME',
        metadata: '{}',
      };

      // First, test with session authentication
      (getServerSession as vi.Mock).mockReturnValueOnce({
        user: { id: 'user_123' },
      });
      (getAuthenticatedUser as vi.Mock).mockReturnValueOnce(null);
      db.paymentRecord.findFirst.mockReturnValueOnce(mockPayment);
      db.paymentRecord.update.mockReturnValueOnce({});

      let request = createMockRequest({
        paymentId: 'pay_flow_test',
        paymentMethod: 'CARD',
        transactionId: 'txn_flow_1',
      });
      let response = await POST(request);
      expect(response.status).toBe(200);

      // Reset mocks without clearing implementation
      (getServerSession as vi.Mock).mockReset();
      (getAuthenticatedUser as vi.Mock).mockReset();
      db.paymentRecord.findFirst.mockReset();
      db.paymentRecord.update.mockReset();

      // Then, test with token authentication
      (getServerSession as vi.Mock).mockReturnValueOnce(null);
      (getAuthenticatedUser as vi.Mock).mockReturnValueOnce({ id: 'user_123' });
      db.paymentRecord.findFirst.mockReturnValueOnce(mockPayment);
      db.paymentRecord.update.mockReturnValueOnce({});

      request = createMockRequest({
        paymentId: 'pay_flow_test',
        paymentMethod: 'UPI',
        transactionId: 'txn_flow_2',
      });
      response = await POST(request);
      expect(response.status).toBe(200);
    });
  });
});

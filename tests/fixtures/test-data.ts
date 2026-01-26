/**
 * Test Fixtures and Mock Data
 *
 * This file contains reusable mock data and fixtures
 * for testing various components of the application.
 */

// User fixtures
export const mockUsers = {
  admin: {
    id: 'admin_123',
    mobileNumber: '9876543210',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  instructor: {
    id: 'instructor_123',
    mobileNumber: '9876543211',
    email: 'instructor@example.com',
    name: 'Instructor User',
    role: 'instructor',
  },
  student: {
    id: 'student_123',
    mobileNumber: '9876543212',
    email: 'student@example.com',
    name: 'Student User',
    role: 'student',
  },
  guest: {
    id: '',
    mobileNumber: '',
    email: '',
    name: '',
  },
};

// Payment fixtures
export const mockPayments = {
  pending: {
    id: 'pay_pending_123',
    paymentId: 'cf_pending_123',
    userId: 'student_123',
    amount: 99,
    status: 'PENDING',
    type: 'SUBSCRIPTION',
    metadata: '{}',
    createdAt: new Date().toISOString(),
  },
  completed: {
    id: 'pay_completed_123',
    paymentId: 'cf_completed_123',
    userId: 'student_123',
    amount: 99,
    status: 'COMPLETED',
    type: 'SUBSCRIPTION',
    metadata: JSON.stringify({
      transactionId: 'txn_123',
      verifiedAt: new Date().toISOString(),
      paymentMethod: 'UPI',
    }),
    createdAt: new Date().toISOString(),
  },
  failed: {
    id: 'pay_failed_123',
    paymentId: 'cf_failed_123',
    userId: 'student_123',
    amount: 99,
    status: 'FAILED',
    type: 'SUBSCRIPTION',
    metadata: '{}',
    createdAt: new Date().toISOString(),
  },
};

// Course fixtures
export const mockCourses = {
  basic: {
    id: 'course_basic_123',
    title: 'Basic Programming Course',
    description: 'Learn the basics of programming',
    price: 499,
    instructorId: 'instructor_123',
    categoryId: 'cat_programming',
    status: 'PUBLISHED',
  },
  premium: {
    id: 'course_premium_123',
    title: 'Advanced Machine Learning',
    description: 'Master machine learning concepts',
    price: 2999,
    instructorId: 'instructor_123',
    categoryId: 'cat_ai_ml',
    status: 'PUBLISHED',
  },
  draft: {
    id: 'course_draft_123',
    title: 'Draft Course',
    description: 'This course is not published',
    price: 0,
    instructorId: 'instructor_123',
    categoryId: 'cat_general',
    status: 'DRAFT',
  },
};

// Cashfree API fixtures
export const mockCashfreeResponses = {
  orderCreated: {
    order_id: 'order_123',
    payment_session_id: 'session_123',
    order_status: 'CREATED',
  },
  orderPaid: {
    order_id: 'order_123',
    payment_session_id: 'session_123',
    order_status: 'PAID',
  },
  paymentSuccess: {
    cf_payment_id: 'pay_123',
    transaction_status: 'SUCCESS',
    payment_method: {
      type: 'UPI',
      utr: 'upi123456789',
    },
    transaction_amount: 99,
  },
  paymentPending: {
    cf_payment_id: 'pay_123',
    transaction_status: 'PENDING',
    payment_method: {
      type: 'CARD',
    },
    transaction_amount: 99,
  },
  paymentFailed: {
    cf_payment_id: 'pay_123',
    transaction_status: 'FAILED',
    payment_message: 'Payment declined by bank',
    payment_method: {
      type: 'CARD',
    },
    transaction_amount: 99,
  },
};

// Webhook payload fixtures
export const mockWebhookPayloads = {
  paymentSuccess: {
    type: 'PAYMENT_SUCCESS_WEBHOOK',
    data: {
      order_id: 'order_123',
      order_amount: 99,
      transaction_amount: 99,
      transaction_status: 'SUCCESS',
      payment_method: {
        type: 'UPI',
        utr: 'upi123456789',
      },
      transaction_id: 'txn_123',
    },
  },
  paymentPending: {
    type: 'PAYMENT_PENDING_WEBHOOK',
    data: {
      order_id: 'order_124',
      order_amount: 99,
      transaction_amount: 99,
      transaction_status: 'PENDING',
      payment_method: {
        type: 'CARD',
      },
      transaction_id: 'txn_124',
    },
  },
};

// Session fixtures
export const mockSessions = {
  valid: {
    user: {
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  expired: {
    user: {
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
    },
    expires: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  noUser: null,
};

// Helper function to create mock requests
export function createMockRequest(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  url?: string;
} = {}) {
  const {
    method = 'GET',
    headers = {},
    body = {},
    url = 'http://localhost:3000/api/test',
  } = options;

  return {
    method,
    headers: new Headers(headers),
    url,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
    formData: Promise.resolve(new FormData()),
    clone: function() { return this; },
  } as unknown as Request;
}

// Helper function to create mock Next.js request
export function createNextRequest(options: {
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  url?: string;
} = {}) {
  const request = createMockRequest(options);

  return {
    ...request,
    nextUrl: new URL(options.url || 'http://localhost:3000'),
    cookies: {
      get: () => undefined,
      set: () => {},
      delete: () => {},
    },
  } as unknown as import('next/server').NextRequest;
}

// Helper to create authentication token
export function createAuthToken(user: { id: string; mobileNumber: string; email?: string; name?: string }): string {
  return Buffer.from(JSON.stringify(user)).toString('base64');
}

// Helper to create mock database responses
export function createMockDbResponse<T>(data: T): Promise<T> {
  return Promise.resolve(data);
}

// Helper to create error responses
export function createErrorResponse(error: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Load Tests - Payment Processing Stress Testing
 * 
 * Scripts to simulate high load on payment verification webhook
 * and measure system performance during payment spikes.
 * 
 * Usage: Run with k6
 * k6 run load/payment-spike.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const webhookDuration = new Trend('webhook_duration');
const orderCreationDuration = new Trend('order_creation_duration');
const webhookErrors = new Counter('webhook_errors');
const idempotencyChecks = new Counter('idempotency_checks');

// Performance gauges
const activeConnections = new Gauge('active_connections');
const dbQueryTime = new Trend('db_query_time');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 5 },    // Warm up
    { duration: '2m', target: 20 },   // Normal load
    { duration: '5m', target: 50 },   // High load
    { duration: '3m', target: 100 },  // Stress test
    { duration: '2m', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800'],  // 95% under 300ms, 99% under 800ms
    errors: ['rate<0.005'],                          // Less than 0.5% errors
    webhook_duration: ['avg<150'],                   // Average webhook under 150ms
    order_creation_duration: ['avg<500'],            // Average order creation under 500ms
  },
};

// Generate test orders
const testOrders = Array.from({ length: 500 }, (_, i) => ({
  orderId: `order_load_${Date.now()}_${i}`,
  paymentId: `pay_load_${Date.now()}_${i}`,
  amount: 9900,
  currency: 'INR',
  customerId: `cust_load_${i % 100}`,
  status: 'SUCCESS',
  signature: 'test_signature_' + i,
}));

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://localhost:3000';
  
  // Track active connections
  activeConnections.add(1);
  
  try {
    // Test 1: Create Payment Order
    const orderStart = Date.now();
    
    const order = testOrders[Math.floor(Math.random() * testOrders.length)];
    
    const createResponse = http.post(
      `${baseUrl}/api/payments/create-order`,
      JSON.stringify({
        amount: order.amount,
        customerId: order.customerId,
        orderId: order.orderId,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'k6-payment-load-test',
          'X-Request-ID': `k6-${__VU}-${__ITER}`,
        },
      }
    );
    
    orderCreationDuration.add(Date.now() - orderStart);
    
    const orderSuccess = check(createResponse, {
      'order creation returns 200': (r) => r.status === 200,
      'order creation returns payment session': (r) => r.json('paymentSessionId') !== undefined,
      'order response time < 500ms': (r) => r.timings.duration < 500,
    });
    
    if (!orderSuccess) {
      errorRate.add(1);
      webhookErrors.add('order_creation_failed');
    } else {
      errorRate.add(0);
    }
    
    // Test 2: Payment Webhook (simulating payment gateway callback)
    const webhookStart = Date.now();
    
    // Simulate webhook with different scenarios
    const webhookPayloads = [
      // Successful payment
      {
        orderId: order.orderId,
        paymentId: order.paymentId,
        status: 'SUCCESS',
        amount: order.amount,
        signature: order.signature,
      },
      // Failed payment
      {
        orderId: order.orderId,
        paymentId: `pay_failed_${Date.now()}`,
        status: 'FAILED',
        amount: order.amount,
        reason: 'Insufficient funds',
      },
    ];
    
    const webhookPayload = webhookPayloads[Math.floor(Math.random() * webhookPayloads.length)];
    
    const webhookResponse = http.post(
      `${baseUrl}/api/payments/verify`,
      JSON.stringify(webhookPayload),
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'cashfree-webhook',
          'X-Webhook-Signature': 'test_signature_for_verification',
        },
      }
    );
    
    webhookDuration.add(Date.now() - webhookStart);
    
    const webhookSuccess = check(webhookResponse, {
      'webhook returns 200': (r) => r.status === 200 || r.status === 400, // 400 for already processed
      'webhook processes quickly < 150ms': (r) => r.timings.duration < 150,
      'webhook returns valid JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
    });
    
    if (!webhookSuccess) {
      errorRate.add(1);
      webhookErrors.add('webhook_processing_failed');
    }
    
    // Test 3: Idempotency Check (duplicate webhook handling)
    const idempotencyStart = Date.now();
    
    // Send the same webhook again
    const duplicateResponse = http.post(
      `${baseUrl}/api/payments/verify`,
      JSON.stringify(webhookPayload),
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'cashfree-webhook',
          'X-Webhook-Signature': 'test_signature_for_verification',
          'X-Duplicate-Request': 'true',
        },
      }
    );
    
    idempotencyChecks.add(1);
    
    check(duplicateResponse, {
      'duplicate webhook handled gracefully': (r) => 
        r.status === 200 || // Success (already processed)
        r.status === 409,   // Conflict (already processed)
    });
    
    // Test 4: Payment Status Check
    const statusResponse = http.get(
      `${baseUrl}/api/payments/${order.orderId}/status`,
      {
        headers: {
          'User-Agent': 'k6-status-check',
        },
      }
    );
    
    check(statusResponse, {
      'status check returns 200': (r) => r.status === 200,
      'status response contains order info': (r) => r.json('orderId') !== undefined,
    });
    
  } finally {
    activeConnections.add(-1);
  }
  
  // Simulate processing time
  sleep(Math.random() * 2 + 0.5);
}

export function handleSummary(data) {
  return {
    'load/payment-summary.json': JSON.stringify(data, null, 2),
    stdout: `Payment Load Test Results:
=========================
Total Requests: ${data.metrics.http_reqs.values.count}
Error Rate: ${(data.metrics.errors.values.rate * 100).toFixed(2)}%
Avg Webhook Duration: ${data.metrics.webhook_duration.values.avg.toFixed(2)}ms
Avg Order Creation: ${data.metrics.order_creation_duration.values.avg.toFixed(2)}ms
95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
Webhook Errors: ${data.metrics.webhook_errors.values}
Idempotency Checks: ${data.metrics.idempotency_checks.values}
`,
  };
}

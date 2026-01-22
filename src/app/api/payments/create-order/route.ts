/**
 * Create Payment Order API
 * Endpoint: /api/payments/create-order
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

// License plan prices
const LICENSE_PRICES: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  basic: { monthly: 49900, yearly: 499900 }, // in paise
  pro: { monthly: 149900, yearly: 1499900 },
  enterprise: { monthly: 499900, yearly: 4999900 },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Please login" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { siteId, planId, billingCycle, amount } = body;

    if (!siteId || !planId || !billingCycle) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Get the WordPress site
    const site = await db.wpSites.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Site not found" } },
        { status: 404 }
      );
    }

    // Calculate price
    const price = amount || LICENSE_PRICES[planId][billingCycle];

    if (price === 0) {
      // Free plan, activate immediately
      const crypto = await import("crypto");
      const apiKey = crypto.randomBytes(32).toString("hex");
      const apiSecret = crypto.randomBytes(64).toString("hex");
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + (billingCycle === "yearly" ? 12 : 1));

      await db.wpSites.update({
        where: { id: siteId },
        data: {
          apiKey,
          apiSecret,
          isActive: true,
          status: "active",
          licenseExpiry: expiryDate,
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          siteId,
          siteName: site.siteName,
          siteUrl: site.siteUrl,
          planId,
          billingCycle,
          price: 0,
          currency: "INR",
          status: "active",
          requiresPayment: false,
        },
      });
    }

    // Create order ID
    const orderId = `WP-${siteId.slice(0, 8)}-${Date.now()}`;

    // Create payment order record
    const paymentOrder = await db.paymentOrders.create({
      data: {
        orderId,
        userId: session.user.id,
        amount,
        currency: "INR",
        status: "pending",
        metadata: {
          type: "wordpress_license",
          siteId,
          planId,
          billingCycle,
        },
      },
    });

    // Generate Cashfree payment session
    // Note: In production, use the actual Cashfree SDK
    const cashfreeConfig = {
      clientId: process.env.CASHFREE_CLIENT_ID || "",
      clientSecret: process.env.CASHFREE_CLIENT_SECRET || "",
    };

    // For demo purposes, return order info
    // In production, create actual Cashfree payment session
    const paymentSessionId = `session_${orderId}_${crypto.randomBytes(16).toString("hex")}`;

    // Create Cashfree order (production code)
    /*
    const cashfreeResponse = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': cashfreeConfig.clientId,
        'x-client-secret': cashfreeConfig.clientSecret,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: price / 100,
        order_currency: 'INR',
        customer_details: {
          customer_id: session.user.id,
          customer_email: session.user.email || '',
          customer_phone: '',
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/wordpress/checkout/success?orderId=${orderId}`,
        },
      }),
    });
    const cashfreeData = await cashfreeResponse.json();
    */

    // Update order with payment session
    await db.paymentOrders.update({
      where: { id: paymentOrder.id },
      data: {
        paymentSessionId,
        metadata: {
          type: "wordpress_license",
          siteId,
          planId,
          billingCycle,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        paymentSessionId,
        siteId,
        siteName: site.siteName,
        siteUrl: site.siteUrl,
        planId,
        billingCycle,
        price: price / 100,
        currency: "INR",
        requiresPayment: true,
        paymentLink: `https://checkout.cashfree.com/${orderId}`,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create order" } },
      { status: 500 }
    );
  }
}

// GET: Get order details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const planId = searchParams.get("plan");
    const billingCycle = searchParams.get("cycle");

    if (!siteId || !planId || !billingCycle) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Missing parameters" } },
        { status: 400 }
      );
    }

    const price = LICENSE_PRICES[planId]?.[billingCycle] || 0;

    return NextResponse.json({
      success: true,
      data: {
        siteId,
        planId,
        billingCycle,
        price: price / 100,
        currency: "INR",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to get order details" } },
      { status: 500 }
    );
  }
}

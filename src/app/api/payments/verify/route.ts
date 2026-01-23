import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Try both authentication methods for compatibility
    let user = null;
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      user = { id: session.user.id };
    } else {
      user = getAuthenticatedUser(request);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, paymentMethod, transactionId, orderId } = body;

    // Handle WordPress license order verification
    if (orderId) {
      const paymentOrder = await db.paymentOrders.findFirst({
        where: {
          orderId,
          userId: user.id,
        },
      });

      if (!paymentOrder) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }

      // Check if already processed
      if (paymentOrder.status === "paid") {
        const site = await db.wpSites.findUnique({
          where: { id: paymentOrder.metadata?.siteId },
        });

        if (site) {
          return NextResponse.json({
            success: true,
            data: {
              siteId: site.id,
              siteName: site.siteName,
              siteUrl: site.siteUrl,
              apiKey: site.apiKey,
              apiSecret: site.apiSecret,
              licenseTier: site.licenseTier,
              status: "active",
            },
          });
        }
      }

      // Mark as paid and generate credentials
      await db.paymentOrders.update({
        where: { id: paymentOrder.id },
        data: { status: "paid" },
      });

      const siteId = paymentOrder.metadata?.siteId;
      if (siteId) {
        const site = await db.wpSites.findUnique({
          where: { id: siteId },
        });

        if (site && !site.apiKey) {
          const apiKey = crypto.randomBytes(32).toString("hex");
          const apiSecret = crypto.randomBytes(64).toString("hex");

          const billingCycle = paymentOrder.metadata?.billingCycle || "monthly";
          const expiryDate = new Date();
          expiryDate.setMonth(
            expiryDate.getMonth() + (billingCycle === "yearly" ? 12 : 1)
          );

          await db.wpSites.update({
            where: { id: site.id },
            data: {
              apiKey,
              apiSecret,
              isActive: true,
              status: "active",
              licenseExpiry: expiryDate,
              userId: user.id,
            },
          });

          return NextResponse.json({
            success: true,
            data: {
              siteId: site.id,
              siteName: site.siteName,
              siteUrl: site.siteUrl,
              apiKey,
              apiSecret,
              licenseTier: site.licenseTier,
              status: "active",
            },
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: { status: paymentOrder.status },
      });
    }

    // Original payment verification logic
    if (!paymentId || !paymentMethod) {
      return NextResponse.json(
        { error: "Payment ID and method are required" },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.paymentRecord.findFirst({
      where: {
        userId: user.id,
        paymentId: paymentId,
        status: "PENDING",
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found or already processed" },
        { status: 404 }
      );
    }

    // Update payment status
    const updatedPayment = await db.paymentRecord.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        metadata: JSON.stringify({
          ...JSON.parse(payment.metadata || "{}"),
          transactionId,
          verifiedAt: new Date().toISOString(),
          paymentMethod,
        }),
      },
    });

    // If it is a subscription payment, activate the subscription
    if (payment.type === "SUBSCRIPTION") {
      const startDate = new Date();
      let endDate = new Date();

      // Set end date based on amount
      if (payment.amount >= 99 && payment.amount < 297) {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (payment.amount >= 297 && payment.amount < 1188) {
        endDate.setMonth(endDate.getMonth() + 3);
      } else if (payment.amount >= 1188) {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      await db.subscription.upsert({
        where: {
          userId_type: {
            userId: user.id,
            type: "MONTHLY",
          },
        },
        update: {
          status: "ACTIVE",
          startDate,
          endDate,
          paymentId: payment.id,
        },
        create: {
          userId: user.id,
          type: "MONTHLY",
          status: "ACTIVE",
          startDate,
          endDate,
          paymentId: payment.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

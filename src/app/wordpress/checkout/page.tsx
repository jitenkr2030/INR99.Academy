"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react";
import { loadCashfree } from "@cashfree/pg-sdk-node";

interface CheckoutData {
  siteId: string;
  siteName: string;
  siteUrl: string;
  planId: string;
  billingCycle: string;
  price: number;
  currency: string;
}

export default function WordPressCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const siteId = searchParams.get("siteId");
  const planId = searchParams.get("plan");
  const billingCycle = searchParams.get("cycle");

  useEffect(() => {
    if (!siteId || !planId || !billingCycle) {
      router.push("/wordpress/register");
      return;
    }

    // Fetch checkout data
    async function fetchCheckoutData() {
      try {
        const response = await fetch(
          `/api/payments/create-order?siteId=${siteId}&plan=${planId}&cycle=${billingCycle}`
        );
        const result = await response.json();

        if (result.success) {
          setCheckoutData({
            siteId: result.data.siteId,
            siteName: result.data.siteName,
            siteUrl: result.data.siteUrl,
            planId: result.data.planId,
            billingCycle: result.data.billingCycle,
            price: result.data.price,
            currency: result.data.currency,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to load checkout data",
            variant: "destructive",
          });
          router.push("/wordpress/register");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load checkout data",
          variant: "destructive",
        });
      }
    }

    fetchCheckoutData();
  }, [siteId, planId, billingCycle, router, toast]);

  async function initiatePayment() {
    if (!checkoutData) return;

    setIsProcessing(true);
    try {
      // Create payment order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: checkoutData.siteId,
          planId: checkoutData.planId,
          billingCycle: checkoutData.billingCycle,
          amount: checkoutData.price,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Payment Error",
          description: result.error?.message || "Failed to create payment order",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Initialize Cashfree checkout
      if (typeof window !== "undefined" && (window as any).Cashfree) {
        const cashfree = (window as any).Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "PRODUCTION" : "SANDBOX",
        });

        cashfree.checkout({
          paymentSessionId: result.data.paymentSessionId,
          returnUrl: `${window.location.origin}/wordpress/checkout/success?orderId=${result.data.orderId}`,
          onSuccess: (data: any) => {
            handlePaymentSuccess(result.data.orderId);
          },
          onFailure: (data: any) => {
            toast({
              title: "Payment Failed",
              description: data.error?.message || "Your payment was not successful",
              variant: "destructive",
            });
            setIsProcessing(false);
          },
        });
      } else {
        // Fallback: redirect to payment link
        window.location.href = result.data.paymentLink;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  }

  async function handlePaymentSuccess(orderId: string) {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Payment Successful!",
          description: "Your license has been activated",
        });
        router.push("/wordpress/dashboard");
      } else {
        toast({
          title: "Verification Pending",
          description: "Payment received but verification is pending. Please wait...",
        });
        setTimeout(() => router.push("/wordpress/dashboard"), 3000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment successful but verification failed. Contact support.",
        variant: "destructive",
      });
    }
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Secure payment for your WordPress plugin license
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {checkoutData.siteName} - {checkoutData.siteUrl}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium capitalize">{checkoutData.planId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-medium capitalize">
                  {checkoutData.billingCycle === "yearly" ? "Yearly (Save 20%)" : "Monthly"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total</span>
                <span className="text-indigo-600">
                  {checkoutData.currency === "INR" ? "₹" : "$"}
                  {checkoutData.price.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Instant Activation
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                Multiple Payment Options
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={initiatePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay ₹{checkoutData.price.toLocaleString()}
            </>
          )}
        </Button>

        {/* Cancel Link */}
        <div className="mt-6 text-center">
          <Link
            href="/wordpress/register"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to registration
          </Link>
        </div>

        {/* Terms */}
        <p className="mt-6 text-xs text-center text-gray-400">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          Your license will be activated immediately after successful payment.
        </p>
      </div>
    </div>
  );
}

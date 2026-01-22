"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Copy, Key, ExternalLink, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<{
    siteId: string;
    siteName: string;
    siteUrl: string;
    apiKey: string;
    apiSecret: string;
    licenseTier: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/wordpress/dashboard");
      return;
    }

    verifyPayment();
  }, [orderId, router]);

  async function verifyPayment() {
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);
        toast({
          title: "Payment Successful!",
          description: "Your WordPress license has been activated",
        });
      } else {
        // Payment might still be processing
        setOrderData(result.data || null);
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your WordPress site license has been activated
          </p>
        </div>

        {/* API Credentials Card */}
        {orderData && (
          <Card className="mb-6 border-indigo-200">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                API Credentials
              </CardTitle>
              <CardDescription>
                Use these credentials to connect your WordPress site to INR99 Academy
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label>Site Name</Label>
                <p className="text-sm text-gray-600">{orderData.siteName}</p>
              </div>

              <div>
                <Label>Site URL</Label>
                <p className="text-sm">
                  <a
                    href={orderData.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    {orderData.siteUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>

              <div>
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={orderData.apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orderData.apiKey, "API Key")}
                  >
                    {isCopied ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label>API Secret</Label>
                <div className="flex gap-2">
                  <Input
                    value={orderData.apiSecret}
                    readOnly
                    type="password"
                    className="font-mono text-sm"
                    id="api-secret"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById("api-secret") as HTMLInputElement;
                      if (input) {
                        input.type = input.type === "password" ? "text" : "password";
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
                <strong>Important:</strong> Keep your API Secret secure. Never share it
                publicly or commit it to version control.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Install WordPress Plugin</h3>
                  <p className="text-sm text-gray-600">
                    Download and install the INR99 plugin from the WordPress repository
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Configure Settings</h3>
                  <p className="text-sm text-gray-600">
                    Enter the API Key and API Secret in the plugin settings page
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Start Syncing</h3>
                  <p className="text-sm text-gray-600">
                    Your courses and content will automatically sync with WordPress
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1"
            onClick={() => router.push("/wordpress/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/dashboard">Back to INR99 Dashboard</Link>
          </Button>
        </div>

        {/* Support */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Need help?{" "}
          <Link href="/contact" className="text-indigo-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}

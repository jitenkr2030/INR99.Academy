"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2 } from "lucide-react";

const formSchema = z.object({
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  siteUrl: z.string().min(1, "Site URL is required").regex(
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
    "Please enter a valid URL"
  ),
  planId: z.enum(["free", "basic", "pro", "enterprise"]),
  billingCycle: z.enum(["monthly", "yearly"]),
});

type FormData = z.infer<typeof formSchema>;

const plans = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    features: ["Up to 5 courses", "100 users", "Basic support"],
  },
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 499, yearly: 4999 },
    features: ["Up to 20 courses", "500 users", "Live classes", "Email support"],
  },
  {
    id: "pro",
    name: "Professional",
    price: { monthly: 1499, yearly: 14999 },
    features: ["Up to 100 courses", "5000 users", "All features", "Priority support", "SSO"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 4999, yearly: 49999 },
    features: ["Unlimited courses", "Unlimited users", "White-label", "Dedicated support"],
  },
];

export default function WordPressRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      planId: "basic",
      billingCycle: "monthly",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wordpress/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Registration Failed",
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      if (result.data.requiresPayment) {
        // Redirect to checkout with site info
        router.push(
          `/wordpress/checkout?siteId=${result.data.siteId}&plan=${data.planId}&cycle=${data.billingCycle}`
        );
      } else {
        // Free plan, go directly to dashboard
        toast({
          title: "Registration Successful",
          description: "Your WordPress site has been registered!",
        });
        router.push("/wordpress/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register site. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your WordPress Site
          </h1>
          <p className="text-gray-600">
            Register your WordPress site and get API keys to integrate with INR99 Academy
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Enter your WordPress site details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My WordPress Site" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://mysite.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              setBillingCycle(v as "monthly" | "yearly");
                            }}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="monthly" id="monthly" />
                              <Label htmlFor="monthly">Monthly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yearly" id="yearly" />
                              <Label htmlFor="yearly">Yearly (Save 20%)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <input type="hidden" {...form.register("planId")} value={selectedPlan} />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Select License Plan</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? "border-indigo-500 ring-2 ring-indigo-500"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    form.setValue("planId", plan.id as FormData["planId"]);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-2xl font-bold">
                          ₹{billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly}
                          <span className="text-sm font-normal text-gray-500">
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        </p>
                      </div>
                      {selectedPlan === plan.id && (
                        <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Copy, Eye, ExternalLink, CreditCard, Key, Settings } from "lucide-react";

interface WordPressSite {
  id: string;
  siteName: string;
  siteUrl: string;
  apiKey: string;
  apiSecret: string;
  isActive: boolean;
  licenseTier: string;
  licenseExpiry: string | null;
  status: string;
  createdAt: string;
  _count?: {
    courses: number;
    liveSessions: number;
    users: number;
  };
}

export default function WordPressDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sites, setSites] = useState<WordPressSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<WordPressSite | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    try {
      const response = await fetch("/api/wordpress/register");
      const result = await response.json();

      if (result.success) {
        setSites(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your WordPress sites",
        variant: "destructive",
      });
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
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  }

  function getStatusBadge(status: string, licenseTier: string) {
    if (status === "pending_payment") {
      return <Badge variant="warning">Pending Payment</Badge>;
    }
    if (!licenseTier) {
      return <Badge variant="secondary">Free Tier</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My WordPress Sites</h1>
            <p className="text-gray-600 mt-1">
              Manage your connected WordPress sites and API credentials
            </p>
          </div>
          <Button onClick={() => router.push("/wordpress/register")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Site
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Key className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sites</p>
                  <p className="text-2xl font-bold">{sites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Sites</p>
                  <p className="text-2xl font-bold">
                    {sites.filter((s) => s.isActive && s.status === "active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payment</p>
                  <p className="text-2xl font-bold">
                    {sites.filter((s) => s.status === "pending_payment").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites Table or Empty State */}
        {sites.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No WordPress Sites Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your first WordPress site to get started with INR99 Academy integration
              </p>
              <Button onClick={() => router.push("/wordpress/register")}>
                <Plus className="mr-2 h-4 w-4" />
                Register Your First Site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connected Sites</CardTitle>
              <CardDescription>
                Manage your WordPress site connections and API credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.siteName}</TableCell>
                      <TableCell>
                        <a
                          href={site.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          {site.siteUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {site.licenseTier || "Free"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(site.status, site.licenseTier)}</TableCell>
                      <TableCell>{formatDate(site.createdAt)}</TableCell>
                      <TableCell>
                        {site.status === "pending_payment" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/wordpress/checkout?siteId=${site.id}&plan=${site.licenseTier}&cycle=monthly`
                              )
                            }
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </Button>
                        ) : site.isActive && site.apiKey ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedSite(site);
                                  setShowCredentials(true);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View API Keys
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>API Credentials</DialogTitle>
                                <DialogDescription>
                                  Use these credentials in your WordPress plugin settings
                                </DialogDescription>
                              </DialogHeader>

                              {selectedSite && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>Site Name</Label>
                                    <p className="text-sm text-gray-600">{selectedSite.siteName}</p>
                                  </div>

                                  <div>
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        value={selectedSite.apiKey}
                                        readOnly
                                        className="font-mono text-sm"
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          copyToClipboard(selectedSite.apiKey, "API Key")
                                        }
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
                                        value={selectedSite.apiSecret}
                                        readOnly
                                        type="password"
                                        className="font-mono text-sm"
                                        id="api-secret"
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const input = document.getElementById(
                                            "api-secret"
                                          ) as HTMLInputElement;
                                          if (input.type === "password") {
                                            input.type = "text";
                                          } else {
                                            input.type = "password";
                                          }
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          copyToClipboard(
                                            selectedSite.apiSecret,
                                            "API Secret"
                                          )
                                        }
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
                                    <strong>Important:</strong> Keep your API Secret secure.
                                    Never share it publicly or commit it to version control.
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Installation Guide</h3>
                <p className="text-sm text-gray-600">
                  Learn how to install and configure the INR99 WordPress plugins on your site
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">API Documentation</h3>
                <p className="text-sm text-gray-600">
                  View the complete API reference for WordPress plugin integration
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-gray-600">
                  Contact our team for assistance with your WordPress integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

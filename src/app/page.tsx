"use client";

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import axios from "axios"
import { Affiliate } from "@/lib/interfaces";
import { Copy, ExternalLink, LinkIcon } from "lucide-react";

export default function Home() {

  const [affiliates, setAffiliates] = useState<Affiliate[] | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const baseUrl = window.location.origin

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/affiliates");
        setAffiliates(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
      }
    };

    fetchData();
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Affiliate Postback System</h1>
          <p className="text-xl text-muted-foreground">Manage your affiliates, campaigns, and track conversions</p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>View Dashboard</CardTitle>
              <CardDescription>Select an affiliate to view their performance dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Affiliate</label>
                <Select value={selectedAffiliate} onValueChange={setSelectedAffiliate} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading affiliates..." : "Choose an affiliate..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      affiliates && affiliates.map((aff) => (
                        <SelectItem key={aff.id} value={aff.id}>
                          {aff.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Link href={`/dashboard/${selectedAffiliate}`} className="flex-1">
                  <Button className="w-full">View Dashboard</Button>
                </Link>
                <Link href={`/postback-url/${selectedAffiliate}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Postback URL
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Manage Affiliates</CardTitle>
              <CardDescription>Add and view your affiliate partners</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/affiliates">
                <Button className="w-full">Go to Affiliates</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Campaigns</CardTitle>
              <CardDescription>Create and manage your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/campaigns">
                <Button className="w-full">Go to Campaigns</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-blue-600" />
              Postback URL Configuration
            </CardTitle>
            <CardDescription>
              Configure and test postback URLs for {(affiliates && affiliates.find(aff => aff.id === selectedAffiliate)?.name) || `Affiliate ${selectedAffiliate}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Click Tracking URL Format</h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <code className="flex-1 text-sm font-mono">
                  {`${baseUrl}/api/click?affiliate_id=${selectedAffiliate ? selectedAffiliate : 'sample123'}&campaign_id=1`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `${baseUrl}/api/click?affiliate_id=${selectedAffiliate ? selectedAffiliate : 'sample123'}&campaign_id=1`,
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Replace affiliate_id=sample123 & campaign_id=1 with your actual campaign & affiliate IDs</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Postback URL (GET Method)</h3>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <code className="flex-1 text-sm font-mono">
                  {`${window.location.origin}/api/postback?affiliate_id=${selectedAffiliate ? selectedAffiliate : 'sample123'}&click_id=sample-click-123&amount=99.99&currency=USD`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/api/postback?affiliate_id=${selectedAffiliate}&click_id=sample-click-123&amount=99.99&currency=USD`,
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `${window.location.origin}/api/postback?affiliate_id=${selectedAffiliate}&click_id=sample-click-123&amount=99.99&currency=USD`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Integration Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use the click tracking URL to redirect users and track clicks</li>
                <li>• Send postback requests when conversions occur</li>
                <li>• Include the click_id from the original click in your postback</li>
                <li>• Amount parameter is optional (defaults to 0 for lead tracking)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

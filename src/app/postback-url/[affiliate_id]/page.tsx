"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, ExternalLink } from "lucide-react"
import axios from "axios"
import { Affiliate } from "@/lib/interfaces"

export default function PostbackUrlPage() {
    const params = useParams()
    const affiliateId = params.affiliate_id as string

    const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    const baseUrl = window.location.origin
    const postbackUrl = `${baseUrl}/postback?affiliate_id=${affiliateId}&click_id={click_id}&amount={amount}&currency={currency}`

    useEffect(() => {
        if (affiliateId) {
            fetchAffiliate()
        }
    }, [affiliateId])

    const fetchAffiliate = async () => {
        setLoading(true)
        try {
            const affiliateResponse = await axios.get(`/api/affiliates`)
            if (affiliateResponse.status === 200) {
                setAffiliate(
                    affiliateResponse.data.find((aff: Affiliate) => aff.id === affiliateId) || null
                )
            }
        } catch (error) {
            console.error("Error fetching affiliate:", error)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(postbackUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error("Failed to copy:", error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading postback URL...</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Postback URL for {affiliate?.name || `Affiliate ${affiliateId}`}
                            </h1>
                            <p className="text-muted-foreground">Use this URL to track conversions from your affiliate network</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/dashboard/${affiliateId}`}>
                                <Button variant="outline">View Dashboard</Button>
                            </Link>
                            <Link href="/affiliates">
                                <Button variant="outline">Back to Affiliates</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Postback URL Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ExternalLink className="h-5 w-5" />
                                Postback URL
                            </CardTitle>
                            <CardDescription>
                                This is your unique postback URL for affiliate ID:
                                <span className="font-mono">{affiliateId}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="postback-url">URL</Label>
                                <div className="flex gap-2 mt-4">
                                    <Input id="postback-url" value={postbackUrl} readOnly className="font-mono text-sm" />
                                    <Button onClick={copyToClipboard} variant="outline" size="icon">
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {copied && <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* URL Parameters Explanation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>URL Parameters</CardTitle>
                            <CardDescription>Understanding the postback URL parameters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">affiliate_id</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Your unique affiliate identifier: <code className="bg-muted px-1 rounded">{affiliateId}</code>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">click_id</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Unique identifier for the click: <code className="bg-muted px-1 rounded">{"{click_id}"}</code>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">amount</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Conversion amount: <code className="bg-muted px-1 rounded">{"{amount}"}</code>
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">currency</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Currency code (e.g., USD, EUR): <code className="bg-muted px-1 rounded">{"{currency}"}</code>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Usage Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>How to Use</CardTitle>
                            <CardDescription>Instructions for implementing the postback URL</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">1. Replace Placeholder Values</h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Replace the placeholder values in curly braces with actual values:
                                    </p>
                                    <div className="bg-muted p-3 rounded-md font-mono text-sm">
                                        {baseUrl}/postback?affiliate_id={affiliateId}&click_id=abc123&amount=29.99&currency=USD
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">2. Fire the Postback</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Send a GET request to this URL when a conversion occurs. This can be done via:
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                                        <li>Server-side HTTP request</li>
                                        <li>JavaScript fetch/axios call</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">3. Verify Tracking</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Check the{" "}
                                        <Link href={`/dashboard/${affiliateId}`} className="text-primary hover:underline">
                                            affiliate dashboard
                                        </Link>{" "}
                                        to verify that conversions are being tracked correctly.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Example Implementation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Example Implementation</CardTitle>
                            <CardDescription>Sample code for different implementation methods</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-semibold">JavaScript (Client-side)</Label>
                                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto mt-2">
                                        {`// Fire postback on conversion
const firePostback = (clickId, amount, currency) => {
  const url = '${baseUrl}/postback?' + 
    'affiliate_id=${affiliateId}&' +
    \`click_id=\${clickId}&\` +
    \`amount=\${amount}&\` +
    \`currency=\${currency}\`;
  
  fetch(url, { method: 'GET' });
};`}
                                    </pre>
                                </div>

                                {/* <div>
                                    <Label className="text-sm font-semibold">HTML Pixel (Image tag)</Label>
                                    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto mt-2">
                                        {`<!-- Replace {click_id}, {amount}, {currency} with actual values -->
<img src="${baseUrl}/postback?affiliate_id=${affiliateId}&click_id={click_id}&amount={amount}&currency={currency}" 
     width="1" height="1" style="display:none;" />`}
                                    </pre>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

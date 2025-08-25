"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, ExternalLink, MousePointer, TrendingUp, LinkIcon } from "lucide-react"
import { Click, Conversion, Affiliate } from "@/lib/interfaces"
import axios from "axios"

export default function AffiliateDashboard() {
    const params = useParams()
    const affiliateId = params.affiliate_id as string

    const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
    const [clicks, setClicks] = useState<Click[]>([])
    const [conversions, setConversions] = useState<Conversion[]>([])
    const [loading, setLoading] = useState(true)
    const [allAffiliates, setAllAffiliates] = useState<Affiliate[]>([])

    const [baseUrl, setBaseUrl] = useState("");

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // console.log(clicks)

    useEffect(() => {
        if (affiliateId) {
            fetchDashboardData()
        }
        fetchAllAffiliates()
    }, [affiliateId])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const affiliateResponse = await axios.get(`/api/affiliates`)
            if (affiliateResponse.status === 200) {
                setAffiliate(
                    affiliateResponse.data.find((aff: Affiliate) => aff.id === affiliateId) || null
                )
            }

            const clicksResponse = await axios.get(`/api/getAffiliateData/${affiliateId}/clicks`)
            if (clicksResponse.status === 200) {
                setClicks(clicksResponse.data)
            }

            const conversionsResponse = await axios.get(`/api/getAffiliateData/${affiliateId}/conversions`)
            if (conversionsResponse.status === 200) {
                setConversions(conversionsResponse.data)
            } else {
                setConversions([])
            }

            setLoading(false)
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        }
    }

    const fetchAllAffiliates = async () => {
        try {
            const response = await axios.get("/api/affiliates")
            if (response.status === 200) {
                setAllAffiliates(response.data)
            }
        } catch (error) {
            console.error("Error fetching affiliates:", error)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const handleAffiliateChange = (newAffiliateId: string) => {
        window.location.href = `/dashboard/${newAffiliateId}`
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(amount)
    }

    const formatDateTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString()
    }

    const totalRevenue = conversions.reduce((sum, conversion) => sum + Number(conversion.amount ?? 0), 0)
    const conversionRate = clicks.length > 0 ? ((conversions.length / clicks.length) * 100).toFixed(2) : "0.00"

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                {/* <Navigation /> */}
                <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading dashboard...</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-lg font-semibold">Select Affiliate</h2>
                        <Select value={affiliateId} onValueChange={handleAffiliateChange}>
                            <SelectTrigger className="w-64">
                                <SelectValue placeholder="Select an affiliate" />
                            </SelectTrigger>
                            <SelectContent>
                                {allAffiliates.map((aff) => (
                                    <SelectItem key={aff.id} value={aff.id.toString()}>
                                        {aff.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gray-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Total Clicks</p>
                                    <p className="text-3xl font-bold">{clicks.length > 0 ? clicks.length : 0}</p>
                                </div>
                                <MousePointer className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Conversions</p>
                                    <p className="text-3xl font-bold">{conversions.length > 0 ? conversions.length : 0}</p>
                                </div>
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Click IDs */}
                <Card className="my-8">
                    <CardHeader>
                        <CardTitle>Available Click IDs</CardTitle>
                        <CardDescription>Use these actual click IDs in your postback URLs instead of sample data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {clicks.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">Click ID</th>
                                            <th className="text-left p-3 font-medium">Campaign ID</th>
                                            <th className="text-left p-3 font-medium">Timestamp</th>
                                            <th className="text-left p-3 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clicks.map((click) => (
                                            <tr key={click.clickId} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{click.clickId}</code>
                                                </td>
                                                <td className="p-3">{click.campaignId}</td>
                                                <td className="p-3 text-sm text-muted-foreground">{formatDateTime(click.createdAt)}</td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                `${baseUrl}/api/postback?affiliate_id=${affiliateId}&click_id=${click.clickId}&amount=99.99&currency=USD`,
                                                            )
                                                        }
                                                    >
                                                        <Copy className="h-3 w-3 mr-1" />
                                                        Copy Postback URL
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No clicks found for this affiliate.</p>
                                <p className="text-sm mt-1">Generate some clicks using the tracking URL above to see click IDs here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Postback URLs config */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-blue-600" />
                            Postback URL Configuration
                        </CardTitle>
                        <CardDescription>
                            Configure and test postback URLs for {affiliate?.name || `Affiliate ${affiliateId}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Click Tracking URL Format</h3>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                                <code className="flex-1 text-sm font-mono">
                                    {`${baseUrl}/api/track?affiliate_id=${affiliateId}&campaign_id=1`}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            `${baseUrl}/api/click?affiliate_id=${affiliateId}&campaign_id=1`,
                                        )
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Replace campaign_id=1 with your actual campaign ID</p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Postback URL (GET Method)</h3>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                                <code className="flex-1 text-sm font-mono">
                                    {`${baseUrl}/api/postback?affiliate_id=${affiliateId}&click_id=sample-click-123&amount=99.99&currency=USD`}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            `${baseUrl}/api/postback?affiliate_id=${affiliateId}&click_id=sample-click-123&amount=99.99&currency=USD`,
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
                                            `${baseUrl}/api/postback?affiliate_id=${affiliateId}&click_id=sample-click-123&amount=99.99&currency=USD`,
                                            "_blank",
                                        )
                                    }
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Replace click_id=sample-click-123 with your actual click ID</p>
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

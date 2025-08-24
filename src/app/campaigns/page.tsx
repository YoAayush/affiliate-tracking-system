"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Campaign } from "@/lib/interfaces"
import axios from "axios"

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [newCampaignName, setNewCampaignName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get("/api/campaigns")
            if (response.status === 200) {
                setCampaigns(response.data)
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error)
        }
    }

    const handleAddCampaign = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCampaignName.trim()) return

        setLoading(true)
        try {
            const response = await axios.post("/api/campaigns", {
                campaignName: newCampaignName,
            })

            if (response.status === 201) {
                setNewCampaignName("")
                fetchCampaigns()
            }
        } catch (error) {
            console.error("Error adding campaign:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Campaigns</h1>
                    <p className="text-muted-foreground">Manage your marketing campaigns</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Campaign</CardTitle>
                            <CardDescription>Create a new marketing campaign</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddCampaign} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Campaign Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={newCampaignName}
                                        onChange={(e) => setNewCampaignName(e.target.value)}
                                        placeholder="Enter campaign name"
                                        required
                                        className="mt-4"
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Adding..." : "Add Campaign"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Campaigns</CardTitle>
                            <CardDescription>View and manage your campaigns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {campaigns.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Created</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {campaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>{campaign.id}</TableCell>
                                                <TableCell>{campaign.name}</TableCell>
                                                <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No campaigns found. Add your first campaign above.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

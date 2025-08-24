"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
// import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { Affiliate } from "@/lib/interfaces"

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([])
    const [newAffiliateName, setNewAffiliateName] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAffiliates()
    }, [])

    const fetchAffiliates = async () => {
        try {
            const response = await axios.get("/api/affiliates")
            setAffiliates(response.data)
        } catch (error) {
            console.error("Error fetching affiliates:", error)
        }
    }

    const handleAddAffiliate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAffiliateName.trim()) return

        setLoading(true)
        try {
            const response = await axios.post("/api/affiliates", {
                affiliateName: newAffiliateName,
            })
            if (response.status === 201) {
                setNewAffiliateName("")
                fetchAffiliates()
            }
        } catch (error) {
            console.error("Error adding affiliate:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Affiliates</h1>
                    <p className="text-muted-foreground">Manage your affiliate partners</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Affiliate</CardTitle>
                            <CardDescription>Create a new affiliate partner</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddAffiliate} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Affiliate Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={newAffiliateName}
                                        onChange={(e) => setNewAffiliateName(e.target.value)}
                                        placeholder="Enter affiliate name"
                                        required
                                        className="mt-4"
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Adding..." : "Add Affiliate"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Existing Affiliates</CardTitle>
                            <CardDescription>View and manage your affiliates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {affiliates.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {affiliates.map((affiliate) => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell>{affiliate.id}</TableCell>
                                                <TableCell>{affiliate.name}</TableCell>
                                                <TableCell className="space-x-2">
                                                    <Link href={`/dashboard/${affiliate.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Dashboard
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/postback-url/${affiliate.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Postback URL
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No affiliates found. Add your first affiliate above.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

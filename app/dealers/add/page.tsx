"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { ArrowLeft, Save, Upload, User, Phone, Mail, MapPin } from "lucide-react"

export default function AddDealerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    specialization: "",
    status: "Active",
    bio: "",
    avatar: "",
  })

  const specializations = [
    "Residential Properties",
    "Commercial Properties",
    "Luxury Properties",
    "Plots & Land",
    "Industrial Properties",
    "Rental Properties",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dealerData = {
        ...form,
        joinedDate: new Date().toISOString(),
        properties: 0,
        totalSales: 0,
        rating: 0,
      }

      const res = await fetch("/api/dealers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealerData),
      })

      if (res.ok) {
        toast.success("Dealer added successfully!")
        router.push("/dealers")
      } else {
        toast.error("Failed to add dealer")
      }
    } catch (error) {
      toast.error("Failed to add dealer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Dealer</h1>
          <p className="text-muted-foreground">Create a new dealer profile for your real estate business</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the dealer's personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ahmed Hassan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +92-300-1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., ahmed@realtor.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., DHA Phase 5, Lahore"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description about the dealer's experience and expertise..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Specify the dealer's professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select
                    value={form.specialization}
                    onValueChange={(value) => setForm({ ...form, specialization: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Dealer"}
              </Button>
              <Button variant="outline" onClick={() => router.push("/dealers")} className="w-full bg-transparent">
                Cancel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload dealer's profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {form.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "D"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Button variant="outline">Upload Photo</Button>
                  <p className="text-sm text-muted-foreground mt-2">Drag and drop or click to upload</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{form.name || "Name not specified"}</div>
                  <div className="text-xs text-muted-foreground">{form.specialization || "No specialization"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">{form.phone || "Phone not specified"}</div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">{form.email || "Email not specified"}</div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">{form.location || "Location not specified"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

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
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Save, MessageCircle, Upload, X } from "lucide-react"
import WhatsAppModal from "@/app/components/WhatsAppModal"

export default function AddInventoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: "",
    type: "",
    size: "",
    location: "",
    price: "",
    beds: "",
    floors: "",
    description: "",
    features: [] as string[],
    status: "Available",
  })

  const [newFeature, setNewFeature] = useState("")

  const propertyTypes = ["House", "Apartment", "Villa", "Plot", "Commercial", "Office", "Shop", "Warehouse"]

  const commonFeatures = [
    "Parking",
    "Garden",
    "Swimming Pool",
    "Gym",
    "Security",
    "Elevator",
    "Balcony",
    "Terrace",
    "Basement",
    "Servant Quarter",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const propertyData = {
        ...form,
        price: Number.parseInt(form.price),
        beds: Number.parseInt(form.beds),
        floors: Number.parseInt(form.floors),
      }

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (res.ok) {
        toast.success("Property added successfully!")
        setShowModal(true)
      } else {
        toast.error("Failed to add property")
      }
    } catch (error) {
      toast.error("Failed to add property")
    } finally {
      setLoading(false)
    }
  }

  const addFeature = (feature: string) => {
    if (feature && !form.features.includes(feature)) {
      setForm({ ...form, features: [...form.features, feature] })
    }
    setNewFeature("")
  }

  const removeFeature = (feature: string) => {
    setForm({ ...form, features: form.features.filter((f) => f !== feature) })
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
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">Create a new property listing for your inventory</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Beautiful 3BR House in DHA"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    placeholder="e.g., 5 Marla, 1 Kanal"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    required
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property features, amenities, and other details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Specify the property specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 15000000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beds">Bedrooms</Label>
                  <Input
                    id="beds"
                    type="number"
                    placeholder="e.g., 3"
                    value={form.beds}
                    onChange={(e) => setForm({ ...form, beds: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors">Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    placeholder="e.g., 2"
                    value={form.floors}
                    onChange={(e) => setForm({ ...form, floors: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
              <CardDescription>Add features and amenities of the property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonFeatures.map((feature) => (
                  <Button
                    key={feature}
                    variant={form.features.includes(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => (form.features.includes(feature) ? removeFeature(feature) : addFeature(feature))}
                  >
                    {feature}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addFeature(newFeature)}
                />
                <Button onClick={() => addFeature(newFeature)} disabled={!newFeature}>
                  Add
                </Button>
              </div>

              {form.features.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Features:</Label>
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
                {loading ? "Saving..." : "Save Property"}
              </Button>
              <Button variant="outline" onClick={handleSubmit} disabled={loading} className="w-full bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                Save & Share on WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>Upload images of the property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;

                    for (const file of files) {
                      const formData = new FormData();
                      formData.append("file", file);

                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();
                      if (data?.url) {
                        console.log("Image uploaded:", data.url);
                        // Optional: store URLs in local state if you want preview or save later
                      } else {
                        console.error("Upload failed");
                      }
                    }
                  }}
                  className="block w-full text-sm text-muted-foreground
             file:mr-4 file:py-2 file:px-4
             file:rounded-md file:border-0
             file:text-sm file:font-semibold
             file:bg-primary/10 file:text-primary
             hover:file:bg-primary/20"
                />

                <p className="text-xs text-muted-foreground">You can select multiple images</p>
              </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Title:</strong> {form.title || "Not specified"}
              </div>
              <div className="text-sm">
                <strong>Type:</strong> {form.type || "Not specified"}
              </div>
              <div className="text-sm">
                <strong>Location:</strong> {form.location || "Not specified"}
              </div>
              <div className="text-sm">
                <strong>Price:</strong>{" "}
                {form.price ? `PKR ${Number.parseInt(form.price).toLocaleString()}` : "Not specified"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showModal && <WhatsAppModal onClose={() => router.push("/inventory")} property={form} />}
    </div>
  )
}

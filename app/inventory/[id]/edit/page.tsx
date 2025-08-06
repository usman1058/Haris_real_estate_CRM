"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ArrowLeft, Save, X, Upload } from "lucide-react"

interface Property {
  id: string
  title: string
  type: string
  location: string
  size: string
  price: number
  beds: number
  floors: number
  status: "Available" | "Sold" | "Pending"
  description?: string
  features?: string[]
  createdAt: string
}

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
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
    status: "Available" as "Available" | "Sold" | "Pending",
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

useEffect(() => {
  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/inventory/${params.id}`);
      if (res.ok) {
        const property: Property = await res.json();

        // Parse features if stored as JSON string
        const features = Array.isArray(property.features)
          ? property.features
          : typeof property.features === "string"
            ? JSON.parse(property.features)
            : [];

        setForm({
          title: property.title,
          type: property.type,
          size: property.size,
          location: property.location,
          price: property.price.toString(),
          beds: property.beds.toString(),
          floors: property.floors.toString(),
          description: property.description || "",
          features, // now always an array
          status: property.status,
        });
      } else {
        toast.error("Property not found");
        router.push("/inventory");
      }
    } catch (error) {
      toast.error("Failed to fetch property details");
      router.push("/inventory");
    } finally {
      setInitialLoading(false);
    }
  };

  if (params.id) fetchProperty();
}, [params.id, router]);


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

      const res = await fetch(`/api/inventory/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (res.ok) {
        toast.success("Property updated successfully!")
        router.push(`/inventory/${params.id}`)
      } else {
        toast.error("Failed to update property")
      }
    } catch (error) {
      toast.error("Failed to update property")
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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">Update property information and details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the basic details of the property</CardDescription>
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
                <CardDescription>Update the property specifications</CardDescription>
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
                  <Select value={form.status} onValueChange={(value: any) => setForm({ ...form, status: value })}>
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
                <CardDescription>Update features and amenities of the property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {commonFeatures.map((feature) => (
                    <Button
                      key={feature}
                      type="button"
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
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature(newFeature))}
                  />
                  <Button type="button" onClick={() => addFeature(newFeature)} disabled={!newFeature}>
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
                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Updating..." : "Update Property"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/inventory/${params.id}`)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
                <CardDescription>Update property images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("id", params.id as string);

                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await res.json();
                      if (data?.url) {
                        toast.success("Image uploaded successfully");
                      } else {
                        toast.error("Upload failed");
                      }
                    }}
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
                <div className="text-sm">
                  <strong>Status:</strong> {form.status}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

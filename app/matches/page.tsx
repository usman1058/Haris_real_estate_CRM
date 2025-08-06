"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Car,
  Shield,
  Waves,
  TreePine,
  MessageCircle,
  Share2,
  Eye,
  Phone,
  Mail,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

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
  images?: string[]
  matchScore?: number
}

interface DemandCriteria {
  budget: number
  size: string
  location: string
  type: string
  demandId: string
}

export default function MatchesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Extract search criteria from URL params
  const criteria: DemandCriteria = {
    budget: Number.parseInt(searchParams.get("budget") || "0"),
    size: searchParams.get("size") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    demandId: searchParams.get("demandId") || "",
  }

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const queryParams = new URLSearchParams({
          budget: criteria.budget.toString(),
          size: criteria.size,
          location: criteria.location,
          type: criteria.type || ""
        });
        const res = await fetch(`/api/matches?${queryParams.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        toast.error("Failed to fetch matching properties");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [searchParams]);


  const handlePropertySelect = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, propertyId])
    } else {
      setSelectedProperties(selectedProperties.filter((id) => id !== propertyId))
    }
  }

  const handleSendMatches = async () => {
    if (selectedProperties.length === 0) {
      toast.error("Please select at least one property to send")
      return
    }

    setSending(true)
    try {
      const selectedProps = properties.filter((p) => selectedProperties.includes(p.id))
      const message = selectedProps
        .map(
          (property) =>
            `🏠 ${property.title}\n📍 ${property.location}\n💰 ${formatCurrency(property.price)}\n📏 ${property.size} • ${property.beds} beds\n${property.description || ""}`,
        )
        .join("\n\n" + "─".repeat(30) + "\n\n")

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          demandId: criteria.demandId,
          properties: selectedProps,
          message,
        }),
      })

      if (response.ok) {
        toast.success("Property matches sent successfully!")
        router.push("/demand")
      } else {
        toast.error("Failed to send matches")
      }
    } catch (error) {
      toast.error("Failed to send matches")
    } finally {
      setSending(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "parking":
        return <Car className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "swimming pool":
        return <Waves className="h-4 w-4" />
      case "garden":
        return <TreePine className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demands
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Property Matches</h1>
            <p className="text-muted-foreground">Properties matching the buyer's requirements</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSendMatches}
            disabled={selectedProperties.length === 0 || sending}
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {sending ? "Sending..." : `Send ${selectedProperties.length} Matches`}
          </Button>
        </div>
      </div>

      {/* Search Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Budget</div>
                <div className="text-sm text-muted-foreground">{formatCurrency(criteria.budget)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Size</div>
                <div className="text-sm text-muted-foreground">{criteria.size}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{criteria.location}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Type</div>
                <div className="text-sm text-muted-foreground">{criteria.type || "Any"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">{properties.length} Properties Found</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedProperties.length} Selected</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProperties(properties.map((p) => p.id))}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedProperties([])}>
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Matches */}
      {properties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
            <p className="text-muted-foreground mb-4">
              No properties match the specified criteria. Try adjusting the search parameters.
            </p>
            <Button onClick={() => router.push("/demand")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demands
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden rounded-t-lg">
                  {property.images && property.images[0] ? (
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">No Image</p>
                    </div>
                  )}
                </div>
                <div className="absolute top-3 left-3 flex space-x-2">
                  <Badge className="bg-white/90 text-gray-800">{property.status}</Badge>
                  {property.matchScore && (
                    <Badge className={`bg-white/90 ${getMatchScoreColor(property.matchScore)}`}>
                      {property.matchScore}% Match
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => handlePropertySelect(property.id, checked as boolean)}
                    className="bg-white/90"
                  />
                </div>
                <div className="absolute bottom-3 left-3">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">{formatCurrency(property.price)}</div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="mr-1 h-3 w-3" />
                      {property.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Building2 className="mr-1 h-3 w-3 text-muted-foreground" />
                        {property.type}
                      </div>
                      <div className="flex items-center">
                        <Home className="mr-1 h-3 w-3 text-muted-foreground" />
                        {property.size}
                      </div>
                      <div className="flex items-center">
                        <Bed className="mr-1 h-3 w-3 text-muted-foreground" />
                        {property.beds} beds
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                  )}

                  {property.features && property.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs flex items-center gap-1">
                          {getFeatureIcon(feature)}
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/inventory/${property.id}`)}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Fixed Bottom Action Bar */}
      {properties.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium">
                  {selectedProperties.length} of {properties.length} properties selected
                </div>
                <Button
                  onClick={handleSendMatches}
                  disabled={selectedProperties.length === 0 || sending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {sending ? "Sending..." : "Send via WhatsApp"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

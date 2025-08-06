"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Building2,
  MapPin,
  Bed,
  Home,
  Grid3X3,
  List,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Car,
  Shield,
  Waves,
  Dumbbell,
  TreePine,
  Building,
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
  createdAt: string
  images?: string
  views?: number
  inquiries?: number
}

const DetailViewInventoryPage = () => {
  const router = useRouter()
  const [inventory, setInventory] = useState<Property[]>([])
  
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/inventory")
        if (!res.ok) throw new Error("Failed to fetch data")
        const data = await res.json()

        // ✅ Parse features if it's a string
        const parsedData = data.map((item: any) => ({
          ...item,
          features: item.features
            ? typeof item.features === "string"
              ? JSON.parse(item.features)
              : item.features
            : [],
        }))

        setInventory(parsedData)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch inventory")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setInventory(inventory.filter((item) => item.id !== id))
        toast.success("Property deleted successfully")
      } else {
        toast.error("Failed to delete property")
      }
    } catch (error) {
      toast.error("Failed to delete property")
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const filteredAndSortedInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesType = typeFilter === "all" || item.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "Sold":
        return <Badge className="bg-red-100 text-red-800">Sold</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "parking":
        return <Car className="h-3 w-3" />
      case "security":
        return <Shield className="h-3 w-3" />
      case "swimming pool":
        return <Waves className="h-3 w-3" />
      case "gym":
        return <Dumbbell className="h-3 w-3" />
      case "garden":
        return <TreePine className="h-3 w-3" />
      case "elevator":
        return <Building className="h-3 w-3" />
      default:
        return <Home className="h-3 w-3" />
    }
  }
  
const PropertyCard = ({ property }: { property: Property }) => {
  const imageList =
    typeof property.images === "string"
      ? JSON.parse(property.images)
      : Array.isArray(property.images)
      ? property.images
      : []

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
          {imageList.length > 0 ? (
            <img
              src={imageList[0]}
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
              {property.beds > 0 && (
                <div className="flex items-center">
                  <Bed className="mr-1 h-3 w-3 text-muted-foreground" />
                  {property.beds} beds
                </div>
              )}
            </div>
          </div>

          {property.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {property.description}
            </p>
          )}

          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs flex items-center gap-1">
                  {getFeatureIcon(feature)}
                  {feature}
                </Badge>
              ))}
              {property.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 4} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {property.views || 0} views
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-1 h-3 w-3" />
                {property.inquiries || 0} inquiries
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/inventory/${property.id}`)}
              >
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push(`/inventory/${property.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Property
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Client
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Property
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete "{property.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(property.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Property Gallery</h1>
          <p className="text-muted-foreground">Detailed view of all your property listings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/inventory/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter((item) => item.status === "Available").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + (item.views || 0), 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + (item.inquiries || 0), 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {filteredAndSortedInventory.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredAndSortedInventory.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
          <p className="text-muted-foreground">
            {search || statusFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first property."}
          </p>
          {!search && statusFilter === "all" && typeFilter === "all" && (
            <Button className="mt-4" onClick={() => router.push("/inventory/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default DetailViewInventoryPage

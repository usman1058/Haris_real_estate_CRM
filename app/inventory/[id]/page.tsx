"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
    ArrowLeft,
    Edit,
    Trash2,
    MapPin,
    Home,
    Bed,
    Building,
    Calendar,
    Share2,
    Phone,
    Mail,
    MessageCircle,
    Eye,
    Heart,
    Star,
    Car,
    Shield,
    Waves,
    Dumbbell,
    TreePine,
    Wifi,
    Zap,
    Users,
    Clock,
    FileText,
    Camera,
    Download,
    PrinterIcon as Print,
} from "lucide-react"
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

interface Property {
    id: string
    title: string
    type: string
    location: string
    size: string
    price: number
    beds: number
    floors: number
    bathrooms?: number
    status: "Available" | "Sold" | "Pending"
    description?: string
    features?: string[]
    createdAt: string
    updatedAt?: string
    images?: string[]
    views?: number
    inquiries?: number
    likes?: number
    agent?: {
        name: string
        phone: string
        email: string
        avatar?: string
    }
}

export default function PropertyDetailPage() {
    const router = useRouter()
    const params = useParams()
    const [property, setProperty] = useState<Property | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)


    useEffect(() => {
        const controller = new AbortController();

        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/inventory/${params.id}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error("Failed to fetch property");

                const data = await res.json();
                setProperty(data);
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    toast.error("Failed to fetch property details");
                    router.push("/inventory");
                }
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProperty();
        }

        return () => controller.abort(); // cleanup to cancel fetch on unmount
    }, [params.id, router]);

    const imageList: string[] = Array.isArray(property.images)
  ? property.images
  : JSON.parse(property.images || "[]");


    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/inventory/${params.id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                toast.success("Property deleted successfully")
                router.push("/inventory")
            } else {
                toast.error("Failed to delete property")
            }
        } catch (error) {
            toast.error("Failed to delete property")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Available":
                return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Available</Badge>
            case "Sold":
                return <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">Sold</Badge>
            case "Pending":
                return <Badge className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2">Pending</Badge>
            default:
                return (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                        {status}
                    </Badge>
                )
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
                return <Car className="h-5 w-5" />
            case "security":
                return <Shield className="h-5 w-5" />
            case "swimming pool":
                return <Waves className="h-5 w-5" />
            case "gym":
                return <Dumbbell className="h-5 w-5" />
            case "garden":
                return <TreePine className="h-5 w-5" />
            case "wifi":
                return <Wifi className="h-5 w-5" />
            case "generator":
                return <Zap className="h-5 w-5" />
            default:
                return <Home className="h-5 w-5" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!property) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Property not found</h3>
                <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
                <Button className="mt-4" onClick={() => router.push("/inventory")}>
                    Back to Inventory
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Inventory
                    </Button>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Print className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/inventory/${property.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
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
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Property Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{property.title}</h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                <span className="text-lg">{property.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge(property.status)}
                </div>
                <div className="text-4xl font-bold text-primary">{formatPrice(property.price)}</div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Gallery */}
                    <Card>
                    <CardContent className="p-0">
                        <div className="relative">
                        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                            <img
                            src={
                                imageList[currentImageIndex] ||
                                "/placeholder.svg?height=400&width=600&text=Property+Image"
                            }
                            alt={`${property.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Button variant="secondary" size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                            <Heart
                                className={`mr-2 h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                            />
                            {property.likes}
                            </Button>
                            <Button variant="secondary" size="sm">
                            <Camera className="mr-2 h-4 w-4" />
                            {imageList.length} Photos
                            </Button>
                        </div>
                        </div>

                        {imageList.length > 1 && (
                        <div className="p-4">
                            <div className="flex space-x-3 overflow-x-auto">
                            {imageList.map((image: string, index: number) => (
                                <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                    currentImageIndex === index
                                    ? "border-primary"
                                    : "border-transparent hover:border-muted-foreground"
                                }`}
                                >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                </button>
                            ))}
                            </div>
                        </div>
                        )}
                    </CardContent>
                    </Card>


                    {/* Property Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Property Description</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-muted-foreground leading-relaxed text-lg">{property.description}</p>

                            <Separator />

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-blue-50">
                                            <Building className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-lg">Property Type</div>
                                            <div className="text-muted-foreground">{property.type}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-green-50">
                                            <Home className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-lg">Size</div>
                                            <div className="text-muted-foreground">{property.size}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-purple-50">
                                            <Bed className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-lg">Bedrooms</div>
                                            <div className="text-muted-foreground">{property.beds} bedrooms</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-lg bg-orange-50">
                                            <Building className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-lg">Floors</div>
                                            <div className="text-muted-foreground">{property.floors} floors</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {property.features?.map((feature) => (
                                        <div key={feature} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                            <div className="text-primary">{getFeatureIcon(feature)}</div>
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Agent Information */}
                    {property.agent && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Property Agent</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={property.agent.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-lg">{property.agent.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-lg">{property.agent.name}</div>
                                        <div className="text-muted-foreground">Licensed Real Estate Agent</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Button className="w-full" size="lg">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {property.agent.phone}
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        WhatsApp
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Agent
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full bg-transparent" size="lg">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent" size="lg">
                                <Users className="mr-2 h-4 w-4" />
                                Schedule Viewing
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent" size="lg">
                                <Star className="mr-2 h-4 w-4" />
                                Mark as Featured
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Property Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="font-medium">Property Created</div>
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {new Date(property.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                            {property.updatedAt && (
                                <div className="space-y-2">
                                    <div className="font-medium">Last Updated</div>
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(property.updatedAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}




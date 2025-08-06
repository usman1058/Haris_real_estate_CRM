"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Share2,
  MessageCircle,
  Star,
  Building2,
  Award,
  Target,
  DollarSign,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Dealer {
  id: string
  name: string
  phone: string
  email?: string
  location: string
  properties: any[] // or a proper type if you want
  totalSales?: number
  rating?: number
  status: "Active" | "Inactive"
  joinedDate: string
  avatar?: string
  specialization?: string
  bio?: string
  achievements?: string[]
  recentProperties?: {
    id: string
    title: string
    price: number
    status: string
    date: string
  }[]
  monthlyStats?: {
    month: string
    properties: number
    sales: number
  }[]
  performance?: {
    target: number
    achieved: number
    percentage: number
  }
}

export default function DealerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(`/api/dealers/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch dealer");
        const data = await res.json();

        // Map API fields into your UI-friendly structure
        const transformed: Dealer = {
          ...data,
          properties: data.properties || [],
          totalSales: data.totalSales ?? 0,
          rating: data.rating ?? 0,
          status: data.status || "Active",
          joinedDate: data.joinedDate || new Date().toISOString(),
          avatar: data.avatar || null,
          specialization: data.specialization || "",
          bio: data.bio || "",
          achievements: data.achievements || [],
          recentProperties: data.properties?.map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            status: p.status,
            date: p.createdAt,
          })),
          monthlyStats: data.monthlyStats || [],
          performance: data.performance || {
            target: 0,
            achieved: 0,
            percentage: 0,
          },
        };

        setDealer(transformed);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch dealer details");
        router.push("/dealers");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDealer();
    }
  }, [params.id, router]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/dealers/${params.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Dealer deleted successfully")
        router.push("/dealers")
      } else {
        toast.error("Failed to delete dealer")
      }
    } catch (error) {
      toast.error("Failed to delete dealer")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800 text-lg px-4 py-2">Inactive</Badge>
      default:
        return (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {status}
          </Badge>
        )
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!dealer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Dealer not found</h3>
        <p className="text-muted-foreground">The dealer you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => router.push("/dealers")}>
          Back to Dealers
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
            Back to Dealers
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
          <Button variant="outline" size="sm" onClick={() => router.push(`/dealers/${dealer.id}/edit`)}>
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
                  This action cannot be undone. This will permanently delete "{dealer.name}" and all associated data.
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

      {/* Dealer Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={dealer.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {dealer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">{dealer.name}</h1>
                  <p className="text-xl text-muted-foreground">{dealer.specialization}</p>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      <span>{dealer.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      <span>Joined {new Date(dealer.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(dealer.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
  {dealer.properties?.length || 0}
</div>

                  <div className="text-sm text-muted-foreground">Properties Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(dealer.totalSales || 0)}</div>
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {dealer.rating && renderStars(dealer.rating)}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating ({dealer.rating}/5)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.floor((Date.now() - new Date(dealer.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{dealer.bio}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <div className="text-sm text-muted-foreground">{dealer.phone}</div>
                        </div>
                      </div>
                      {dealer.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Email</div>
                            <div className="text-sm text-muted-foreground">{dealer.email}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="properties" className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Recent Properties</h3>
                  <div className="space-y-3">
                    {dealer.recentProperties?.map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Listed on {new Date(property.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(property.price)}</div>
                          <Badge
                            variant={
                              property.status === "Sold"
                                ? "default"
                                : property.status === "Available"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Current Performance</h3>
                    {dealer.performance && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Target Achievement</span>
                          <span>
                            {dealer.performance.achieved}/{dealer.performance.target} properties
                          </span>
                        </div>
                        <Progress value={dealer.performance.percentage} className="h-3" />
                        <div className="text-center text-sm text-muted-foreground">
                          {dealer.performance.percentage}% of target achieved
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Monthly Statistics</h3>
                    <div className="space-y-3">
                      {dealer.monthlyStats?.map((stat) => (
                        <div key={stat.month} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="font-medium">{stat.month}</div>
                          <div className="text-right">
                            <div className="font-medium">{stat.properties} properties</div>
                            <div className="text-sm text-muted-foreground">{formatCurrency(stat.sales)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Awards & Achievements</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {dealer.achievements?.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Dealer
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Active Listings</span>
                </div>
                <span className="font-medium">{dealer.properties?.length || 0}</span>

              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Total Sales</span>
                </div>
                <span className="font-medium">{formatCurrency(dealer.totalSales || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">{dealer.rating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Target Progress</span>
                </div>
                <span className="font-medium">{dealer.performance?.percentage}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Property sold</div>
                    <div className="text-xs text-muted-foreground">Luxury Villa in DHA - 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">New listing added</div>
                    <div className="text-xs text-muted-foreground">Modern Apartment - 1 day ago</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Client meeting</div>
                    <div className="text-xs text-muted-foreground">Property viewing scheduled - 2 days ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

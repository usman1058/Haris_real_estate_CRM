"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Users,
  MapPin,
  Phone,
  Building2,
  TrendingUp,
  Star,
  Mail,
} from "lucide-react"

interface Dealer {
  id: string
  name: string
  phone: string
  email?: string
  location: string
  properties: number
  totalSales?: number
  rating?: number
  status: "Active" | "Inactive"
  joinedDate: string
  avatar?: string
  specialization?: string
}

const DealersPage = () => {
  const router = useRouter()
  const [dealers, setDealers] = useState<Dealer[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dealers");
        if (!res.ok) throw new Error("Failed to fetch dealers");

        const data = await res.json();

        // Map backend data to the table’s Dealer interface
        const mappedDealers: Dealer[] = data.map((dealer: any) => ({
          id: dealer.id.toString(),
          name: dealer.name,
          phone: dealer.phone || "",
          email: dealer.email || "",
          location: dealer.location || "",
          properties: dealer.properties || 0,
          totalSales: dealer.propertiesList
            ? dealer.propertiesList.reduce((sum: number, p: any) => sum + (p.price || 0), 0)
            : undefined,
          rating: dealer.rating || undefined, // optional if you have a rating column
          status: dealer.status || "Active", // defaulting to Active for now
          joinedDate: dealer.joinedDate || dealer.createdAt,
          avatar: dealer.avatar || "/placeholder.svg",
          specialization: dealer.specialization || "",
        }));

        setDealers(mappedDealers);
      } catch (error) {
        toast.error("Failed to fetch dealers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dealers/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDealers(dealers.filter((dealer) => dealer.id !== id))
        toast.success("Dealer deleted successfully")
      } else {
        toast.error("Failed to delete dealer")
      }
    } catch (error) {
      toast.error("Failed to delete dealer")
    }
  }

  const filteredDealers = dealers.filter((dealer) => {
    const matchesSearch =
      dealer.name.toLowerCase().includes(search.toLowerCase()) ||
      dealer.location.toLowerCase().includes(search.toLowerCase()) ||
      dealer.phone.includes(search)
    const matchesStatus = statusFilter === "all" || dealer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dealers Management</h1>
          <p className="text-muted-foreground">Manage your real estate dealers and their performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/dealers/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Dealer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dealers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Dealers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dealers.filter((dealer) => dealer.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealers.reduce((sum, dealer) => sum + dealer.properties, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dealers.reduce((sum, dealer) => sum + (dealer.totalSales || 0), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dealers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Dealers</CardTitle>
          <CardDescription>A comprehensive list of all registered dealers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search dealers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDealers.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={dealer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {dealer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{dealer.name}</div>
                          <div className="text-sm text-muted-foreground">{dealer.specialization}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                          {dealer.phone}
                        </div>
                        {dealer.email && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="mr-2 h-3 w-3" />
                            {dealer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {dealer.location}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{dealer.properties}</TableCell>
                    <TableCell className="font-medium">
                      {dealer.totalSales ? formatCurrency(dealer.totalSales) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {dealer.rating ? renderStars(dealer.rating) : "N/A"}
                        {dealer.rating && <span className="text-sm text-muted-foreground ml-2">{dealer.rating}</span>}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(dealer.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(dealer.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/dealers/${dealer.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dealers/${dealer.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Dealer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Dealer
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the dealer "{dealer.name}"
                                  and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(dealer.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDealers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No dealers found</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first dealer."}
              </p>
              {!search && statusFilter === "all" && (
                <Button className="mt-4" onClick={() => router.push("/dealers/add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Dealer
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DealersPage

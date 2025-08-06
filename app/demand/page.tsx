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
  DollarSign,
  Target,
  MessageCircle,
  User,
  Home,
} from "lucide-react"

interface Demand {
  id: string
  size: string
  location: string
  budget: number
  type?: string
  clientName?: string
  clientPhone?: string
  createdAt: string
  status: "Active" | "Matched" | "Closed"
  priority: "High" | "Medium" | "Low"
  description?: string
}

const DemandPage = () => {
  const router = useRouter()
  const [demands, setDemands] = useState<Demand[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/demand");
        if (!res.ok) throw new Error("Failed to fetch demands");
        const data = await res.json();
        setDemands(data);
      } catch (error) {
        toast.error("Failed to fetch demands");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/demand/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDemands(demands.filter((demand) => demand.id !== id))
        toast.success("Demand deleted successfully")
      } else {
        toast.error("Failed to delete demand")
      }
    } catch (error) {
      toast.error("Failed to delete demand")
    }
  }

  const handleFindMatches = (demand: Demand) => {
    const queryParams = new URLSearchParams({
      budget: demand.budget.toString(),
      size: demand.size,
      location: demand.location,
      type: demand.type || "",
      demandId: demand.id,
    })
    router.push(`/matches?${queryParams.toString()}`)
  }

  const filteredDemands = demands.filter((demand) => {
    const matchesSearch =
      demand.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      demand.location.toLowerCase().includes(search.toLowerCase()) ||
      demand.size.toLowerCase().includes(search.toLowerCase()) ||
      demand.type?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || demand.status === statusFilter
    const matchesType = typeFilter === "all" || demand.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "Matched":
        return <Badge className="bg-blue-100 text-blue-800">Matched</Badge>
      case "Closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "Low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
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
          <h1 className="text-3xl font-bold tracking-tight">Buyer Demands</h1>
          <p className="text-muted-foreground">Manage and track all buyer requirements and demands</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/demand/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Demand
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Demands</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demands.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Demands</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {demands.filter((demand) => demand.status === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {demands.filter((demand) => demand.status === "Matched").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(demands.reduce((sum, demand) => sum + demand.budget, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demands Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Buyer Demands</CardTitle>
          <CardDescription>Complete list of buyer requirements and property demands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search demands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Matched">Matched</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Requirements</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemands.map((demand) => (
                  <TableRow key={demand.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">{demand.clientName || "Anonymous"}</div>
                        </div>
                        {demand.clientPhone && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-2 h-3 w-3" />
                            {demand.clientPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{demand.type || "Any"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{demand.size}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {demand.location}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(demand.budget)}</TableCell>
                    <TableCell>{getPriorityBadge(demand.priority)}</TableCell>
                    <TableCell>{getStatusBadge(demand.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(demand.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => router.push(`/demand/${demand.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFindMatches(demand)}>
                            <Target className="mr-2 h-4 w-4" />
                            Find Matches
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/demand/${demand.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Demand
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Contact Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Demand
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the demand from "
                                  {demand.clientName || "Anonymous"}" and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(demand.id)}
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

          {filteredDemands.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No demands found</h3>
              <p className="text-muted-foreground">
                {search || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first buyer demand."}
              </p>
              {!search && statusFilter === "all" && typeFilter === "all" && (
                <Button className="mt-4" onClick={() => router.push("/demand/add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Demand
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DemandPage

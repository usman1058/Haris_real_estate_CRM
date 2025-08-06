"use client"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Download,
  FileText,
  TrendingDown,
  Building2,
  Users,
  DollarSign,
  Target,
  Calendar,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ReportData {
  id: string
  [key: string]: any
}

interface Analytics {
  totalProperties: number
  totalDealers: number
  totalDemands: number
  totalSales: number
  monthlyGrowth: number
  averagePrice: number
  topLocations: { location: string; count: number; percentage: number }[]
  salesTrend: { month: string; sales: number; properties: number }[]
  propertyTypes: { type: string; count: number; value: number }[]
  dealerPerformance: { name: string; properties: number; sales: number }[]
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [type, setType] = useState("properties")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchData()
    fetchAnalytics()
  }, [type, fromDate, toDate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ type, fromDate, toDate })
      const res = await fetch(`/api/reports?${params}`)
      const result = await res.json()

      setData(result.reportData || [])
    } catch (error) {
      toast.error("Failed to fetch report data")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/reports?type=${type}`)
      const result = await res.json()
      setAnalytics(result.analytics)
    } catch (error) {
      toast.error("Failed to fetch analytics")
    }
  }

  const generateMockData = (reportType: string): ReportData[] => {
    switch (reportType) {
      case "properties":
        return [
          {
            id: "1",
            title: "Luxury Villa in DHA",
            type: "Villa",
            location: "DHA Phase 5",
            price: "25,000,000",
            status: "Available",
            dealer: "Ahmed Hassan",
            createdAt: "2024-01-15",
          },
          {
            id: "2",
            title: "Modern Apartment",
            type: "Apartment",
            location: "Gulberg III",
            price: "18,000,000",
            status: "Sold",
            dealer: "Sarah Khan",
            createdAt: "2024-01-20",
          },
          {
            id: "3",
            title: "Commercial Plot",
            type: "Plot",
            location: "Johar Town",
            price: "12,000,000",
            status: "Pending",
            dealer: "Muhammad Ali",
            createdAt: "2024-01-25",
          },
        ]
      case "dealers":
        return [
          {
            id: "1",
            name: "Ahmed Hassan",
            phone: "+92-300-1234567",
            location: "DHA Phase 5",
            properties: "45",
            sales: "15,000,000",
            rating: "4.8",
            status: "Active",
          },
          {
            id: "2",
            name: "Sarah Khan",
            phone: "+92-301-9876543",
            location: "Gulberg III",
            properties: "32",
            sales: "12,000,000",
            rating: "4.6",
            status: "Active",
          },
        ]
      case "demands":
        return [
          {
            id: "1",
            client: "Ali Ahmed",
            phone: "+92-300-1234567",
            size: "5 Marla",
            location: "DHA Phase 5",
            budget: "15,000,000",
            status: "Active",
            priority: "High",
          },
          {
            id: "2",
            client: "Sarah Khan",
            phone: "+92-301-9876543",
            size: "10 Marla",
            location: "Gulberg III",
            budget: "25,000,000",
            status: "Matched",
            priority: "Medium",
          },
        ]
      default:
        return []
    }
  }

  const exportCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export")
      return
    }

    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(",")).join("\n")
    const csv = `${headers}\n${rows}`

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Report exported successfully")
  }

  const exportPDF = () => {
    toast.info("PDF export functionality would be implemented here")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "sold":
        return <Badge className="bg-red-100 text-red-800">Sold</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "matched":
        return <Badge className="bg-blue-100 text-blue-800">Matched</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and detailed reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={exportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV} disabled={data.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalProperties || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <svg
                    className="inline h-3 w-3 mr-1 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Dealers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalDealers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <svg
                    className="inline h-3 w-3 mr-1 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics?.totalSales || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <svg
                    className="inline h-3 w-3 mr-1 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                  +{analytics?.monthlyGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Buyer Demands</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalDemands || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
                  -3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Monthly sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(analytics?.salesTrend && analytics.salesTrend.length > 0) ? analytics.salesTrend : [
                      { month: "Jan", properties: 0 },
                      { month: "Feb", properties: 0 },
                      { month: "Mar", properties: 0 },
                      { month: "Apr", properties: 0 },
                      { month: "May", properties: 0 },
                      { month: "Jun", properties: 0 },
                    ]}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="properties" fill="var(--color-properties)" />
                    </BarChart>
                  </ResponsiveContainer>


                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Types Distribution</CardTitle>
                <CardDescription>Breakdown by property categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Properties",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.propertyTypes || []}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analytics?.propertyTypes?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Locations</CardTitle>
              <CardDescription>Most popular areas by property count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topLocations?.map((location, index) => (
                  <div key={location.location} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{location.location}</span>
                        <span className="text-sm text-muted-foreground">
                          {location.count} properties ({location.percentage}%)
                        </span>
                      </div>
                      <Progress value={location.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dealer Performance</CardTitle>
                <CardDescription>Top performing dealers by sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.dealerPerformance || []}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                    </BarChart>
                  </ResponsiveContainer>

                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Properties</CardTitle>
                <CardDescription>Properties listed per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    properties: {
                      label: "Properties",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.salesTrend || []}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="properties" fill="var(--color-properties)" />
                    </BarChart>
                  </ResponsiveContainer>

                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Property Price</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(analytics?.averagePrice || 0)}
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sales Conversion Rate</span>
                    <span className="text-sm text-muted-foreground">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Customer Satisfaction</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Reports Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reports</CardTitle>
              <CardDescription>Generate comprehensive reports with filters and date ranges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="properties">Properties Report</SelectItem>
                      <SelectItem value="dealers">Dealers Report</SelectItem>
                      <SelectItem value="demands">Demands Report</SelectItem>
                      <SelectItem value="sales">Sales Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-date">From Date</Label>
                  <Input id="from-date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-date">To Date</Label>
                  <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={fetchData} disabled={loading} className="w-full">
                    {loading ? (
                      <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                    ) : (
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                    )}
                    Generate Report
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Data Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium capitalize">{type} Report</span>
                    <Badge variant="outline">{data.length} records</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2L2 22h20L12 2z" />
                      </svg>
                      Share
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(data[0] || {}).map((key) => (
                          <th key={key} className="font-medium">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Data Found</h3>
                            <p className="text-muted-foreground">
                              {loading ? "Loading report data..." : "No data available for the selected criteria."}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        data.map((row, idx) => (
                          <tr key={idx}>
                            {Object.entries(row).map(([key, value], i) => (
                              <td key={i}>
                                {key === "status" && typeof value === "string"
                                  ? getStatusBadge(value)
                                  : key === "priority" && typeof value === "string"
                                    ? getPriorityBadge(value)
                                    : value?.toString() || "N/A"}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create custom reports with specific metrics and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-muted-foreground mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Custom Report Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced report builder with drag-and-drop functionality coming soon.
                </p>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

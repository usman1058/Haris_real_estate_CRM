"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Building2,
  Search,
  Link,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import PropertyChart from "@/app/components/dashboard/PropertyChart"
import LocationDistribution from "@/app/components/dashboard/LocationPie"
import TopLocations from "@/app/components/dashboard/TopLocations"
import SmartInsights from "@/app/components/dashboard/SmartInsights"
import RecentActivity from "@/app/components/dashboard/StatsOverview"
import QuickActions from "@/app/components/dashboard/QuickAction"
import PerformanceMetrics from "@/app/components/dashboard/MetricCard"

const Dashboard = () => {
  const [data, setData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch("/api/dashboard")
      const result = await res.json()
      setData(result)
    }
    fetchDashboardData()
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const metrics = [
    {
      title: "Total Dealers",
      value: data.totalDealers,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Properties",
      value: data.totalInventory,
      change: "+8%",
      trend: "up",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Buyer Demands",
      value: data.totalDemands,
      change: "-3%",
      trend: "down",
      icon: Search,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Smart Matches",
      value: data.matches,
      change: "+24%",
      trend: "up",
      icon: Link,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6 pt-10 pl-10">

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {[
    {
      title: "Total Properties",
      total: data.totalInventory,
      monthly: data.inventoryThisMonth,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Dealers",
      total: data.totalDealers,
      monthly: data.dealersThisMonth,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Buyer Demands",
      total: data.totalDemands,
      monthly: data.demandsThisMonth,
      icon: Search,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Smart Matches",
      total: data.matches,
      monthly: data.matchesThisMonth,
      icon: Link,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ].map((item, index) => {
    const Icon = item.icon
    return (
      <Card key={index} className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium text-muted-foreground">{item.title}</div>
          <div className={`p-1.5 rounded-md ${item.bgColor}`}>
            <Icon className={`h-4 w-4 ${item.color}`} />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="text-xl font-semibold leading-none">{item.total}</div>
          <span className="text-xs pt-2 text-muted-foreground">{item.monthly} this month</span>
        </div>
      </Card>
    )
  })}
</div>


      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Property Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Property Listings Overview</CardTitle>
                <CardDescription>Track your property listings performance over time</CardDescription>
              </div>
              
            </div>
          </CardHeader>
          <CardContent>
            <PropertyChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
            <CardDescription>Properties spread across different locations</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationDistribution data={data.locationPie} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Metrics */}
        {/* Top Dealers */}
<Card className="col-span-3">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Top Performing Locations</CardTitle>
        <CardDescription>Based on buyer demand and available inventory</CardDescription>
      </div>
      
    </div>
  </CardHeader>
  <CardContent>
    <TopLocations locations={data.topLocations} />
  </CardContent>
</Card>



        {/* Quick Actions */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Dealers */}
        {/* Metrics Summary (was Top Dealers) */}
{/* <Card>
  <CardHeader>
    <CardTitle>Performance Metrics</CardTitle>
    <CardDescription>Key business KPIs</CardDescription>
  </CardHeader>
  <CardContent>
    <PerformanceMetrics />
  </CardContent>
</Card> */}


        {/* Smart Insights */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Smart Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </div>
              <Badge variant="secondary">AI</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <SmartInsights insights={data.smartInsights} />
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default Dashboard
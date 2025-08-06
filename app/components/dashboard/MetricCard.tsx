"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const PerformanceMetrics = () => {
  const metrics = [
    {
      label: "Conversion Rate",
      value: 68,
      target: 75,
      status: "good",
    },
    {
      label: "Response Time",
      value: 92,
      target: 90,
      status: "excellent",
    },
    {
      label: "Customer Satisfaction",
      value: 85,
      target: 80,
      status: "excellent",
    },
    {
      label: "Deal Closure Rate",
      value: 45,
      target: 60,
      status: "needs-improvement",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "needs-improvement":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "needs-improvement":
        return <Badge className="bg-orange-100 text-orange-800">Needs Work</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{metric.label}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{metric.value}%</span>
              {getStatusBadge(metric.status)}
            </div>
          </div>
          <Progress value={metric.value} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Target: {metric.target}%</span>
            <span>{metric.value >= metric.target ? "Above" : "Below"} target</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PerformanceMetrics

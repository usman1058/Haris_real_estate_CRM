"use client"
import { Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react"

const SmartInsights = ({ insights = [] }: { insights?: string[] }) => {
  const getInsightIcon = (index: number) => {
    const icons = [Lightbulb, TrendingUp, AlertTriangle, Target]
    const Icon = icons[index % icons.length]
    return <Icon className="h-4 w-4" />
  }

  const getInsightType = (index: number) => {
    const types = ["tip", "growth", "warning", "goal"]
    return types[index % types.length]
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "tip":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "growth":
        return "bg-green-50 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "goal":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => {
        const type = getInsightType(index)
        return (
          <div key={index} className={`p-3 rounded-lg border ${getInsightColor(type)} flex items-start space-x-3`}>
            <div className="mt-0.5">{getInsightIcon(index)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{insight}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SmartInsights

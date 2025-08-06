"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ActivityItem = {
  user: string
  action: string
  target: string
  time: string
  type: string
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/dashboard?type=recent_activities")
        const data = await res.json()
        setActivities(data)
      } catch (error) {
        console.error("Failed to fetch recent activities:", error)
      }
    }
    fetchActivities()
  }, [])

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "property":
        return <Badge className="bg-blue-100 text-blue-800">Property</Badge>
      case "dealer":
        return <Badge className="bg-green-100 text-green-800">Dealer</Badge>
      case "match":
        return <Badge className="bg-purple-100 text-purple-800">Match</Badge>
      case "report":
        return <Badge className="bg-orange-100 text-orange-800">Report</Badge>
      default:
        return <Badge variant="secondary">Activity</Badge>
    }
  }

  const renderActivityList = (list: ActivityItem[]) => (
    <div className="space-y-4">
      {list.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                <span className="text-muted-foreground"> {activity.action} </span>
                <span className="font-medium">{activity.target}</span>
              </p>
              {getActivityBadge(activity.type)}
            </div>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )

  if (!activities.length) {
    return <p className="text-sm text-muted-foreground">No recent activities yet.</p>
  }

  const latestThree = activities.slice(0, 3)
  const hasMore = activities.length > 3

  return (
    <div className="space-y-4">
      {renderActivityList(latestThree)}

      {hasMore && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              View All Activities ({activities.length - 3} more)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Activities</DialogTitle>
            </DialogHeader>
            {renderActivityList(activities)}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default RecentActivity

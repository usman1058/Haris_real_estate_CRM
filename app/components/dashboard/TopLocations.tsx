"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TopLocation {
  location: string
  demands: number
  inventory: number
}

const MAX_VISIBLE = 4

const TopLocations = ({ locations = [] }: { locations?: TopLocation[] }) => {
  const [open, setOpen] = useState(false)
  const maxDemands = Math.max(...locations.map((l) => l.demands || 1))

  const visibleLocations = locations.slice(0, MAX_VISIBLE)
  const extraLocations = locations.slice(MAX_VISIBLE)

  const renderLocation = (loc: TopLocation, index: number) => (
    <div key={index} className="flex items-center space-x-4">
      <div className="flex items-center space-x-3 flex-1">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {loc.location
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium leading-none">{loc.location}</p>
            <Badge variant="secondary" className="text-xs">
              {loc.inventory} inventories
            </Badge>
          </div>
          <Progress value={(loc.demands / maxDemands) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{loc.demands} buyer demands</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {visibleLocations.map(renderLocation)}

      {extraLocations.length > 0 && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-xs">
              View All ({extraLocations.length} more)
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>All Top Locations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {visibleLocations.concat(extraLocations).map(renderLocation)}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default TopLocations

"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type LocationData = { location: string; count: number }

const COLORS = [
  "#4f46e5", // Indigo
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#6366f1", // Violet
  "#14b8a6", // Teal
  "#8b5cf6", // Purple
  "#f43f5e", // Rose
]

const RADIAN = Math.PI / 180

const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px]"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const LocationDistribution = ({ data = [] }: { data?: LocationData[] }) => {
  const [open, setOpen] = useState(false)

  const cleanedData = data
    .filter((d) => d && d.count && d.location)
    .map((d) => ({ ...d, count: Number(d.count) }))

  const topThree = cleanedData.slice(0, 3)
  const remaining = cleanedData.slice(3)

  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={cleanedData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
            label={renderLabel}
            labelLine={false}
          >
            {cleanedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Location List */}
      <div className="space-y-3">
        {topThree.map((item, index) => (
          <div
            key={item.location}
            className="flex items-center justify-between text-sm border rounded-md px-3 py-2"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium">{item.location}</span>
            </div>
            <span className="text-muted-foreground">{item.count} properties</span>
          </div>
        ))}

        {/* Show "View All" button if there are remaining items */}
        {remaining.length > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                View All ({remaining.length} more)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>All Locations</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                {cleanedData.map((item, index) => (
                  <div
                    key={item.location}
                    className="flex items-center justify-between text-sm border rounded-md px-3 py-2"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {item.count} properties
                    </span>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

export default LocationDistribution

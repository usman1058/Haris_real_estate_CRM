"use client"

import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMemo } from "react"

interface LocationData {
  location: string
  value: number
}

const step = 50000
const MAX_LOCATIONS = 5 // Show top 5 locations + "Others"

const PropertyChart = ({ data = [] }: { data?: LocationData[] }) => {
  // ✅ Sort data by value (highest first)
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  // ✅ Slice top locations, group the rest as "Others"
  const displayedData =
    sortedData.length > MAX_LOCATIONS
      ? [
          ...sortedData.slice(0, MAX_LOCATIONS),
          {
            location: "Others",
            value: sortedData.slice(MAX_LOCATIONS).reduce((sum, item) => sum + item.value, 0),
          },
        ]
      : sortedData

  const maxY = Math.max(...displayedData.map((d) => d.value || 0))
  const roundedMax = Math.ceil(maxY / step) * step

  const yTicks = useMemo(() => {
    const ticks = []
    for (let i = step; i <= roundedMax; i += step) {
      ticks.push(i)
    }
    return ticks
  }, [maxY])

  const chartConfig = {
    value: {
      label: "Listings",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayedData}>
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="location"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={yTicks}
            tickFormatter={(value) =>
              value >= 1000 ? `${Math.round(value / 1000)}k` : value
            }
          />

          <Tooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            fill="url(#fillValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default PropertyChart

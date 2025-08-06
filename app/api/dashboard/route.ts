import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/* ====================== GET (Stats + Recent) ======================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    // ✅ Recently added Properties (with dealer info)
    if (type === "recent_properties") {
      const properties = await prisma.inventory.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          dealer: { select: { name: true, phone: true, email: true, location: true } },
        },
      })
      return NextResponse.json(properties || [])
    }

    // ✅ Recently added Dealers
    if (type === "recent_dealers") {
      const dealers = await prisma.dealer.findMany({
        orderBy: { id: "desc" },
        take: 5,
      })
      return NextResponse.json(dealers || [])
    }

    // ✅ Recently added Demands
    if (type === "recent_demands") {
      const demands = await prisma.demand.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      })
      return NextResponse.json(demands || [])
    }

    // ✅ Recently recorded Activities
    if (type === "recent_activities") {
      const activities = await prisma.recentActivity.findMany({
        orderBy: { time: "desc" },
        take: 10,
      })
      return NextResponse.json(
        (activities || []).map((a) => ({
          user: a.user,
          action: a.action,
          target: a.target,
          time: timeAgo(a.time),
          type: a.type,
        }))
      )
    }

    /* ====================== DASHBOARD SUMMARY ======================= */
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const dealersThisMonth = await prisma.dealer.count({
      where: { createdAt: { gte: startOfMonth } },
    })

    const inventoryThisMonth = await prisma.inventory.count({
      where: { createdAt: { gte: startOfMonth } },
    })

    const demandsThisMonth = await prisma.demand.count({
      where: { createdAt: { gte: startOfMonth } },
    })

    const matchesThisMonth = Math.min(inventoryThisMonth, demandsThisMonth)

    const totalDealers = await prisma.dealer.count()
    const totalInventory = await prisma.inventory.count()
    const totalDemands = await prisma.demand.count()
    const matches = Math.min(totalInventory, totalDemands)

    // Chart data - avg price per location
    const chartDataRaw = await prisma.inventory.groupBy({
      by: ["location"],
      _count: { location: true },
      _avg: { price: true },
    })

    const chartData = chartDataRaw.map((entry) => ({
      location: entry.location,
      value: Number(entry._avg.price?.toFixed(0) || 0),
    }))

    // Pie chart - property count per location
    const locationPie = await prisma.inventory.groupBy({
      by: ["location"],
      _count: { location: true },
    })

    // Top demand-heavy locations
    const demandByLocation = await prisma.demand.groupBy({
      by: ["location"],
      _count: { location: true },
    })

    const inventoryByLocation = await prisma.inventory.groupBy({
      by: ["location"],
      _count: { location: true },
    })

    const topLocations = demandByLocation
      .map((demandLoc) => {
        const matchingInv = inventoryByLocation.find(
          (inv) => inv.location === demandLoc.location
        )
        return {
          location: demandLoc.location,
          demands: demandLoc._count.location,
          inventory: matchingInv?._count.location || 0,
        }
      })
      .sort((a, b) => b.demands - a.demands)
      .slice(0, 5)

    const smartInsights = [
      "Add more listings in popular areas.",
      "High demand for 5 marla properties in DHA.",
      "Target dealers with low property count.",
      "Recheck prices in Model Town listings.",
    ]

    return NextResponse.json({
      totalDealers,
      totalInventory,
      totalDemands,
      matches,
      chartData,
      locationPie: locationPie.map((group) => ({
        location: group.location,
        count: group._count.location,
      })),
      topLocations,
      smartInsights,
      dealersThisMonth,
      inventoryThisMonth,
      demandsThisMonth,
      matchesThisMonth,
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

/* ====================== POST (Quick Actions) ======================= */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")
    const body = await req.json()

    if (action === "add_dealer") {
      const dealer = await prisma.dealer.create({ data: body })
      await logActivity("System", "added new dealer", dealer.name, "dealer")
      return NextResponse.json(dealer)
    }

    if (action === "add_inventory") {
      const inventory = await prisma.inventory.create({ data: body })
      await logActivity("System", "added new property", inventory.title, "property")
      return NextResponse.json(inventory)
    }

    if (action === "add_demand") {
      const demand = await prisma.demand.create({ data: body })
      await logActivity(
        "System",
        "added new demand",
        `${demand.size} in ${demand.location}`,
        "match"
      )
      return NextResponse.json(demand)
    }

    return new NextResponse("Invalid Action", { status: 400 })
  } catch (error) {
    console.error("Quick Action Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

/* ====================== Helpers ======================= */
async function logActivity(
  user: string,
  action: string,
  target: string,
  type: string
) {
  await prisma.recentActivity.create({
    data: { user, action, target, type },
  })
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  const minutes = Math.floor(diff / 60)
  const hours = Math.floor(minutes / 60)

  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? "s" : ""} ago`
}

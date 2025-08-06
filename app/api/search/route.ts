import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.toLowerCase()

    if (!query) {
      return NextResponse.json({ dealers: [], properties: [] })
    }

    const dealers = await prisma.dealer.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
    })

    const properties = await prisma.inventory.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { size: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    })

    return NextResponse.json({ dealers, properties })
  } catch (err) {
    console.error("Search API Error:", err)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

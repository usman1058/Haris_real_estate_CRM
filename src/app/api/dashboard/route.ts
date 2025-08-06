// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalDealers = await prisma.dealer.count();
    const totalInventory = await prisma.inventory.count();
    const totalDemands = await prisma.demand.count();

    const matches = Math.min(totalInventory, totalDemands); // dummy logic

    const chartData = await prisma.inventory.findMany({
      orderBy: { createdAt: 'asc' },
      take: 7,
    });

    const locationPie = await prisma.inventory.groupBy({
      by: ['location'],
      _count: { location: true },
    });

    const topDealers = await prisma.dealer.findMany({
      orderBy: { properties: 'desc' },
      take: 5,
    });

    const smartInsights = [
      "Add more listings in popular areas.",
      "High demand for 5 marla properties in DHA.",
      "Target dealers with low property count.",
      "Recheck prices in Model Town listings.",
    ];

    return NextResponse.json({
      totalDealers,
      totalInventory,
      totalDemands,
      matches,
      chartData: chartData.map((inv) => ({
        date: inv.createdAt.toISOString().split('T')[0],
        value: inv.price,
      })),
      locationPie: locationPie.map((group) => ({
        location: group.location,
        count: group._count.location,
      })),
      topDealers,
      smartInsights,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

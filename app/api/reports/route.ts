import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "properties";
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const dateFilter: any = {};
    if (fromDate) dateFilter.gte = new Date(fromDate);
    if (toDate) dateFilter.lte = new Date(toDate);

    let data: any[] = [];

    /* ========== REPORT DATA ========== */
    if (type === "properties") {
      data = await prisma.inventory.findMany({
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
        select: {
          id: true,
          title: true,
          type: true,
          location: true,
          price: true,
          status: true,
          dealer: { select: { name: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });

      data = data.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        location: p.location,
        price: p.price.toLocaleString(),
        status: p.status,
        dealer: p.dealer?.name || "N/A",
        createdAt: p.createdAt.toISOString().split("T")[0],
      }));
    }

    if (type === "dealers") {
      data = await prisma.dealer.findMany({
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
        select: {
          id: true,
          name: true,
          phone: true,
          location: true,
          properties: { select: { id: true } },
          sales: true,
          rating: true,
          status: true,
        },
        orderBy: { id: "desc" },
      });

      data = data.map((d) => ({
        id: d.id,
        name: d.name,
        phone: d.phone || "N/A",
        location: d.location || "N/A",
        properties: d.properties.length,
        sales: d.sales?.toLocaleString() || "0",
        rating: d.rating?.toFixed(1) || "N/A",
        status: d.status || "Active",
      }));
    }

    if (type === "demands") {
      data = await prisma.demand.findMany({
        where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {},
        orderBy: { createdAt: "desc" },
      });

      data = data.map((d) => ({
        id: d.id,
        client: d.client || "Unknown",
        phone: d.phone || "N/A",
        size: d.size,
        location: d.location,
        budget: d.budget?.toLocaleString(),
        status: d.status,
        priority: d.priority || "Medium",
      }));
    }

    if (type === "sales") {
      data = await prisma.inventory.findMany({
        where: {
          status: "Sold",
          ...(Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}),
        },
        orderBy: { createdAt: "desc" },
      });

      data = data.map((s) => ({
        id: s.id,
        title: s.title,
        location: s.location,
        price: s.price?.toLocaleString(),
        createdAt: s.createdAt.toISOString().split("T")[0],
      }));
    }

    /* ========== ANALYTICS ========== */
    const totalProperties = await prisma.inventory.count();
    const totalDealers = await prisma.dealer.count();
    const totalDemands = await prisma.demand.count();
    const totalSalesAgg = await prisma.inventory.aggregate({
      _sum: { price: true },
      where: { status: "Sold" },
    });

    const avgPrice = await prisma.inventory.aggregate({
      _avg: { price: true },
    });

    const locationCounts = await prisma.inventory.groupBy({
      by: ["location"],
      _count: { location: true },
    });

    const topLocations = locationCounts
      .map((loc) => ({
        location: loc.location,
        count: loc._count.location,
        percentage: ((loc._count.location / totalProperties) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sales Trend (last 6 months)
    // Sales Trend (last 6 months, fallback if no data)
    // Always return last 12 months, even if empty
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Get raw counts and sales
    const rawTrend = await prisma.$queryRawUnsafe<any[]>(`
  SELECT
    CAST(strftime('%m', datetime(createdAt)) AS INTEGER) AS monthNumber,
    SUM(price) AS sales,
    COUNT(*) AS properties
  FROM Inventory
  WHERE createdAt >= DATE('now', '-12 months')
  GROUP BY monthNumber
  ORDER BY monthNumber
`);

    // Fill all months, even if no records
    const salesTrend = monthNames.map((month, idx) => {
      const found = rawTrend.find(r => r.monthNumber === idx + 1);
      return {
        month,
        sales: found ? Number(found.sales) : 0,
        properties: found ? Number(found.properties) : 0
      };
    });

    const propertyTypesCount = await prisma.inventory.groupBy({
      by: ["type"],
      _count: { type: true },
      _sum: { price: true },
    });

    const propertyTypes = propertyTypesCount.map((pt) => ({
      type: pt.type,
      count: pt._count.type,
      value: pt._sum.price || 0,
    }));

    const dealerPerformance = await prisma.dealer.findMany({
      select: {
        name: true,
        properties: { select: { price: true, status: true } },
      },
    });

    const dealerPerformanceFormatted = dealerPerformance.map((dealer) => {
      const totalSales = dealer.properties
        .filter((p) => p.status === "Sold")
        .reduce((sum, p) => sum + (p.price || 0), 0);

      return {
        name: dealer.name,
        properties: dealer.properties.length,
        sales: totalSales,
      };
    });

    /* ========== RESPONSE ========== */
    return NextResponse.json({
      data,
      analytics: {
        totalProperties,
        totalDealers,
        totalDemands,
        totalSales: totalSalesAgg._sum.price || 0,
        monthlyGrowth: 12.5,
        averagePrice: avgPrice._avg.price || 0,
        topLocations,
        salesTrend,
        propertyTypes,
        dealerPerformance: dealerPerformanceFormatted,
      },
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

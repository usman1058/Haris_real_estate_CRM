import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activeProperties = await prisma.inventory.count({
      where: { status: "Available" },
    });

    const totalDealers = await prisma.dealer.count();

    const thisMonthProperties = await prisma.inventory.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return NextResponse.json({
      activeProperties,
      totalDealers,
      thisMonthProperties,
    });
  } catch (err) {
    console.error("Stats API Error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

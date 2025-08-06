import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const budget = parseFloat(searchParams.get("budget") || "0");
    const size = searchParams.get("size") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";

    const properties = await prisma.inventory.findMany({
      where: {
        status: "Available",
        ...(size ? { size: { contains: size } } : {}),
        ...(location ? { location: { contains: location } } : {}),
        ...(type ? { type: { contains: type } } : {}),
        ...(budget > 0
          ? { price: { gte: budget * 0.8, lte: budget * 1.2 } }
          : {})
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // ✅ Always make features an array for the frontend
    const formatted = properties.map((p) => ({
      ...p,
      features:
        typeof p.features === "string"
          ? p.features.split(",").map((f) => f.trim())
          : Array.isArray(p.features)
          ? p.features
          : []
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET Matches Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

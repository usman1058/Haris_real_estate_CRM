// app/api/dealer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ================== GET /api/dealer ================== */
export async function GET() {
  try {
    const dealers = await prisma.dealer.findMany({
      include: {
        _count: { select: { properties: true } }, // count of properties
        properties: true, // include property list if needed
      },
    });

    const formattedDealers = dealers.map((dealer) => ({
      id: dealer.id,
      name: dealer.name,
      phone: dealer.phone,
      email: dealer.email,
      location: dealer.location,
      properties: dealer._count.properties,
      joinedDate: dealer.createdAt,
      // You can add more computed fields like total sales if you track them
    }));

    return NextResponse.json(formattedDealers);
  } catch (error) {
    console.error("GET Dealers Error:", error);
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}

/* ================== POST /api/dealer ================== */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newDealer = await prisma.dealer.create({
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        location: body.location || null,
      },
    });

    return NextResponse.json(newDealer, { status: 201 });
  } catch (error) {
    console.error("POST Dealer Error:", error);
    return NextResponse.json({ error: "Failed to create dealer" }, { status: 500 });
  }
}

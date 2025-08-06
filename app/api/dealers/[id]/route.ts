// app/api/dealer/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ================== GET /api/dealer/[id] ================== */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealerId = parseInt(params.id);
    if (isNaN(dealerId)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    const dealer = await prisma.dealer.findUnique({
      where: { id: dealerId },
      include: {
        properties: true, // include related inventory items
      },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json(dealer);
  } catch (error) {
    console.error("GET Dealer Error:", error);
    return NextResponse.json({ error: "Failed to fetch dealer" }, { status: 500 });
  }
}

/* ================== PUT /api/dealer/[id] ================== */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealerId = parseInt(params.id);
    if (isNaN(dealerId)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedDealer = await prisma.dealer.update({
      where: { id: dealerId },
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        location: body.location || null,
      },
    });

    return NextResponse.json(updatedDealer);
  } catch (error) {
    console.error("PUT Dealer Error:", error);
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 });
  }
}

/* ================== DELETE /api/dealer/[id] ================== */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealerId = parseInt(params.id);
    if (isNaN(dealerId)) {
      return NextResponse.json({ error: "Invalid dealer ID" }, { status: 400 });
    }

    await prisma.dealer.delete({ where: { id: dealerId } });

    return NextResponse.json({ message: "Dealer deleted successfully" });
  } catch (error) {
    console.error("DELETE Dealer Error:", error);
    return NextResponse.json({ error: "Failed to delete dealer" }, { status: 500 });
  }
}

// app/api/inventory/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ================== GET /api/inventory/[id] ================== */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params may be async
) {
  try {
    const { id } = await context.params; // ✅ await params
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
    }

    const property = await prisma.inventory.findUnique({
      where: { id: numericId },
      include: {
        dealer: {
          select: { name: true, email: true, phone: true, location: true }, // avatar removed
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...property,
      features:
        typeof property.features === "string"
          ? JSON.parse(property.features)
          : property.features || [],
      images:
        typeof property.images === "string"
          ? JSON.parse(property.images)
          : property.images || [],
      agent: property.dealer
        ? {
            name: property.dealer.name,
            phone: property.dealer.phone,
            email: property.dealer.email,
            avatar: "/placeholder.svg?height=100&width=100&text=Agent",
          }
        : null,
    });
  } catch (error) {
    console.error("GET Property Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ================== PUT /api/inventory/[id] ================== */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await params
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await prisma.inventory.update({
      where: { id: numericId },
      data: {
        title: body.title || "",
        type: body.type || "",
        size: body.size || "",
        location: body.location || "",
        price: Number(body.price) || 0,
        beds: Number(body.beds) || 0,
        floors: Number(body.floors) || 0,
        status: body.status || "Available",
        description: body.description || "",
        features: JSON.stringify(body.features || []),
        images: JSON.stringify(body.images || []),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Property Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ================== DELETE /api/inventory/[id] ================== */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await params
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
    }

    await prisma.inventory.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("DELETE Property Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

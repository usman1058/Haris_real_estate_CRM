// app/api/demand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all demands
export async function GET(req: NextRequest) {
  try {
    const demands = await prisma.demand.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(demands);
  } catch (error) {
    console.error("GET Demands Error:", error);
    return NextResponse.json({ error: "Failed to fetch demands" }, { status: 500 });
  }
}

// POST create demand
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDemand = await prisma.demand.create({
      data: {
        size: body.size,
        location: body.location,
        budget: body.budget,
        type: body.type || null,
        clientName: body.clientName || null,
        clientPhone: body.clientPhone || null,
      }
    });
    return NextResponse.json(newDemand, { status: 201 });
  } catch (error) {
    console.error("POST Demand Error:", error);
    return NextResponse.json({ error: "Failed to create demand" }, { status: 500 });
  }
}

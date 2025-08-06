// app/api/inventory/route.ts

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

// GET: fetch all inventory
export async function GET() {
  try {
    const properties = await prisma.inventory.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error("Inventory GET error:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

// POST: create new inventory (with image support)
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type")
    let body: any = {}
    let imageUrl = null

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("image") as File

      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadsDir = path.join(process.cwd(), "public/uploads")
        await mkdir(uploadsDir, { recursive: true })

        const filename = `${Date.now()}-${file.name}`
        const filepath = path.join(uploadsDir, filename)
        await writeFile(filepath, buffer)
       imageUrl = `/uploads/${filename}`;
      }

      body = {
      title: formData.get("title") || "",
      type: formData.get("type") || "",
      size: formData.get("size") || "",
      location: formData.get("location") || "",
      price: parseInt(formData.get("price") as string) || 0,
      beds: parseInt(formData.get("beds") as string) || 0,
      floors: parseInt(formData.get("floors") as string) || 0,
      status: formData.get("status") || "Available",
      description: formData.get("description") || "",
      features: formData.get("features")
        ? JSON.stringify(formData.get("features"))
        : "[]",
      images: imageUrl ? JSON.stringify([imageUrl]) : "[]", // ✅ Store as JSON string
    }

    } else {
      const json = await req.json()
      body = {
        ...json,
        features: Array.isArray(json.features) ? JSON.stringify(json.features) : json.features,
      }
    }

    const created = await prisma.inventory.create({ data: body })
    return NextResponse.json(created)
  } catch (error) {
    console.error("Inventory POST error:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

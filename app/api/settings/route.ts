// app/api/settings/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get the first settings record or create default
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          theme: "light",
          notificationsEnabled: true,
          emailPreferences: true,
          systemName: "My CRM",
          apiKey: "",
          defaultCurrency: "USD",
          maxUsers: 50,
        },
      })
    }

    return NextResponse.json({
      general: {
        theme: settings.theme as "light" | "dark" | "system",
        notificationsEnabled: settings.notificationsEnabled,
        emailPreferences: settings.emailPreferences,
      },
      admin: {
        systemName: settings.systemName,
        apiKey: settings.apiKey,
        defaultCurrency: settings.defaultCurrency,
        maxUsers: settings.maxUsers,
      },
    })
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    let updateData: any = {}

    if (body.general) {
      updateData = {
        theme: body.general.theme,
        notificationsEnabled: body.general.notificationsEnabled,
        emailPreferences: body.general.emailPreferences,
      }
    }

    if (body.admin) {
      updateData = {
        ...updateData,
        systemName: body.admin.systemName,
        apiKey: body.admin.apiKey,
        defaultCurrency: body.admin.defaultCurrency,
        maxUsers: body.admin.maxUsers,
      }
    }

    const updatedSettings = await prisma.settings.upsert({
      where: { id: 1 }, // assumes single settings row with id=1
      update: updateData,
      create: {
        id: 1,
        theme: "light",
        notificationsEnabled: true,
        emailPreferences: true,
        systemName: "My CRM",
        apiKey: "",
        defaultCurrency: "USD",
        maxUsers: 50,
        ...updateData,
      },
    })

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("POST /api/settings error:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

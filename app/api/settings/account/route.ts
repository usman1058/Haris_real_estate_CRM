import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newPassword } = await req.json()

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password || "")
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

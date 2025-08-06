import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all profiles (Admins) or current user's profile (Users/Dealers)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId"); // from auth/session
    const role = searchParams.get("role") || "user"; // from auth/session

    let profiles;

    if (role === "admin") {
      profiles = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          bio: true,
          avatar: true,
          phone: true,
          location: true,
          joinDate: true,
          status: true,
          lastLogin: true,
        },
        orderBy: { joinDate: "desc" },
      });
    } else {
      profiles = await prisma.user.findMany({
        where: { id: userId || "" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          bio: true,
          avatar: true,
          phone: true,
          location: true,
          joinDate: true,
          status: true,
          lastLogin: true,
        },
      });
    }

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

/**
 * Create a new profile (Admin only)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role } = body.currentUser || {}; // pass from frontend
    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const newProfile = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        bio: body.bio,
        avatar: body.avatar,
        phone: body.phone,
        location: body.location,
        joinDate: new Date(body.joinDate),
        status: body.status,
        lastLogin: new Date(),
      },
    });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

/**
 * Update profile (User can edit self, Admin can edit anyone)
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { role, currentUserId } = body.currentUser || {};

    if (role !== "admin" && currentUserId !== body.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedProfile = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email,
        role: role === "admin" ? body.role : undefined,
        bio: body.bio,
        avatar: body.avatar,
        phone: body.phone,
        location: body.location,
        status: role === "admin" ? body.status : undefined,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

/**
 * Delete profile (Admin only, cannot delete own profile)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const currentUserId = searchParams.get("currentUserId");
    const role = searchParams.get("role");

    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (id === currentUserId) {
      return NextResponse.json({ error: "Cannot delete own profile" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: id || "" } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/profile error:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}

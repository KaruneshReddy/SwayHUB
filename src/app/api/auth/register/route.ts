import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: "PENDING",
      },
    })

    // Create appropriate profile based on role
    if (role === UserRole.INFLUENCER) {
      await prisma.influencerProfile.create({
        data: {
          userId: user.id,
          displayName: name,
          nicheCategories: [],
          verifiedPlatforms: [],
          totalFollowers: 0,
          avgEngagementRate: 0,
          pricingPerPost: 0,
          pricingPerStory: 0,
          profileComplete: false,
        },
      })
    } else if (role === UserRole.SPONSOR) {
      await prisma.sponsorProfile.create({
        data: {
          userId: user.id,
          companyName: name,
          profileComplete: false,
        },
      })
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
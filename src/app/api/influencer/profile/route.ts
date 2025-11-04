import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { error: "Only influencers can update influencer profiles" },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.displayName,
        status: "ACTIVE", // Mark as active after completing onboarding
      },
    })

    // Update or create influencer profile
    const influencerProfile = await prisma.influencerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        displayName: data.displayName,
        bio: data.bio,
        location: data.location,
        profileImageUrl: data.profileImageUrl,
        nicheCategories: data.nicheCategories || [],
        pricingPerPost: data.pricingPerPost || 0,
        pricingPerStory: data.pricingPerStory || 0,
        socialLinks: data.socialLinks || [],
        profileComplete: true,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        displayName: data.displayName,
        bio: data.bio,
        location: data.location,
        profileImageUrl: data.profileImageUrl,
        nicheCategories: data.nicheCategories || [],
        pricingPerPost: data.pricingPerPost || 0,
        pricingPerStory: data.pricingPerStory || 0,
        socialLinks: data.socialLinks || [],
        profileComplete: true,
      },
    })

    // Store portfolio items if provided
    if (data.portfolioItems && data.portfolioItems.length > 0) {
      await prisma.portfolioItem.deleteMany({
        where: { influencerId: influencerProfile.id },
      })

      await prisma.portfolioItem.createMany({
        data: data.portfolioItems.map((item: any) => ({
          influencerId: influencerProfile.id,
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          linkUrl: item.linkUrl,
          itemType: "portfolio",
        })),
      })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
      influencerProfile,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { error: "Only influencers can view influencer profiles" },
        { status: 403 }
      )
    }

    const influencerProfile = await prisma.influencerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        portfolioItems: true,
      },
    })

    if (!influencerProfile) {
      return NextResponse.json(
        { error: "Influencer profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(influencerProfile)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
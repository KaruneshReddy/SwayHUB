import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/db"
import { UserRole, SwipeDirection } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== UserRole.SPONSOR) {
      return NextResponse.json(
        { error: "Only sponsors can swipe on influencers" },
        { status: 403 }
      )
    }

    const { influencerId, direction } = await request.json()

    if (!influencerId || !direction) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!Object.values(SwipeDirection).includes(direction)) {
      return NextResponse.json(
        { error: "Invalid swipe direction" },
        { status: 400 }
      )
    }

    // Get sponsor profile
    const sponsorProfile = await prisma.sponsorProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!sponsorProfile) {
      return NextResponse.json(
        { error: "Sponsor profile not found" },
        { status: 404 }
      )
    }

    // Get influencer profile
    const influencerProfile = await prisma.influencerProfile.findUnique({
      where: { id: influencerId },
    })

    if (!influencerProfile) {
      return NextResponse.json(
        { error: "Influencer profile not found" },
        { status: 404 }
      )
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findFirst({
      where: {
        influencerId,
        sponsorId: sponsorProfile.id,
      },
    })

    if (existingMatch) {
      return NextResponse.json(
        { error: "Match already exists" },
        { status: 400 }
      )
    }

    // Create the swipe record
    const match = await prisma.match.create({
      data: {
        influencerId,
        sponsorId: sponsorProfile.id,
        swipeDirection: direction as SwipeDirection,
        status: direction === SwipeDirection.RIGHT ? "PENDING" : "REJECTED",
      },
      include: {
        influencer: {
          include: {
            user: true,
          },
        },
        sponsor: {
          include: {
            user: true,
          },
        },
      },
    })

    // Check if this creates a mutual match (both swiped right)
    if (direction === SwipeDirection.RIGHT) {
      const influencerSwipe = await prisma.match.findFirst({
        where: {
          influencerId,
          sponsorId: sponsorProfile.id,
          swipeDirection: SwipeDirection.RIGHT,
          createdBy: "INFLUENCER", // Assuming we track who created the swipe
        },
      })

      if (influencerSwipe) {
        // Update both matches to ACCEPTED status
        await prisma.match.updateMany({
          where: {
            OR: [
              { id: match.id },
              { id: influencerSwipe.id },
            ],
          },
          data: {
            status: "ACCEPTED",
          },
        })

        // Return the created match
        return NextResponse.json({
          message: "It's a match!",
          match: {
            ...match,
            status: "ACCEPTED",
          },
        })
      }
    }

    return NextResponse.json({
      message: direction === SwipeDirection.RIGHT ? "Like recorded" : "Pass recorded",
      match,
    })
  } catch (error) {
    console.error("Swipe error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
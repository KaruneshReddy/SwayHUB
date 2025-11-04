import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let matches = []

    if (session.user.role === UserRole.SPONSOR) {
      // Get sponsor's matches
      const sponsorProfile = await prisma.sponsorProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!sponsorProfile) {
        return NextResponse.json(
          { error: "Sponsor profile not found" },
          { status: 404 }
        )
      }

      matches = await prisma.match.findMany({
        where: {
          sponsorId: sponsorProfile.id,
          status: "ACCEPTED",
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
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    } else if (session.user.role === UserRole.INFLUENCER) {
      // Get influencer's matches
      const influencerProfile = await prisma.influencerProfile.findUnique({
        where: { userId: session.user.id },
      })

      if (!influencerProfile) {
        return NextResponse.json(
          { error: "Influencer profile not found" },
          { status: 404 }
        )
      }

      matches = await prisma.match.findMany({
        where: {
          influencerId: influencerProfile.id,
          status: "ACCEPTED",
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
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return NextResponse.json(matches)
  } catch (error) {
    console.error("Matches fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
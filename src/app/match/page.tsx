"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SwipeCard } from "@/components/match/SwipeCard"
import { X, Heart, RefreshCw, MessageCircle, User } from "lucide-react"
import { SwipeCardData } from "@/types"

export default function MatchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cards, setCards] = useState<SwipeCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState<"left" | "right" | "up" | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    if (session.user.role !== "SPONSOR") {
      router.push("/dashboard")
      return
    }

    fetchInfluencers()
  }, [session, status, router])

  const fetchInfluencers = async () => {
    setIsLoading(true)
    try {
      // Mock data for now - in production this would fetch from API
      const mockInfluencers: SwipeCardData[] = [
        {
          id: "1",
          displayName: "Sarah Johnson",
          bio: "Fashion and lifestyle content creator with a passion for sustainable brands",
          profileImageUrl: "/placeholder-avatar-1.jpg",
          nicheCategories: ["fashion", "sustainability", "lifestyle"],
          totalFollowers: 45000,
          avgEngagementRate: 3.8,
          pricingPerPost: 750,
          verifiedPlatforms: ["instagram", "tiktok"],
          socialLinks: [
            { platform: "instagram", url: "https://instagram.com/sarahj", followers: 45000, verified: true },
            { platform: "tiktok", url: "https://tiktok.com/@sarahj", followers: 25000, verified: true },
          ],
        },
        {
          id: "2",
          displayName: "Mike Chen",
          bio: "Tech reviewer focused on gadgets and productivity tools",
          profileImageUrl: "/placeholder-avatar-2.jpg",
          nicheCategories: ["tech", "gadgets", "productivity"],
          totalFollowers: 120000,
          avgEngagementRate: 5.2,
          pricingPerPost: 1500,
          verifiedPlatforms: ["youtube", "twitter"],
          socialLinks: [
            { platform: "youtube", url: "https://youtube.com/mikechen", followers: 120000, verified: true },
            { platform: "twitter", url: "https://twitter.com/mikechen", followers: 35000, verified: true },
          ],
        },
        {
          id: "3",
          displayName: "Emma Wilson",
          bio: "Fitness coach helping people achieve their health goals",
          profileImageUrl: "/placeholder-avatar-3.jpg",
          nicheCategories: ["fitness", "health", "wellness"],
          totalFollowers: 78000,
          avgEngagementRate: 6.1,
          pricingPerPost: 900,
          verifiedPlatforms: ["instagram", "youtube"],
          socialLinks: [
            { platform: "instagram", url: "https://instagram.com/emmawilson", followers: 78000, verified: true },
            { platform: "youtube", url: "https://youtube.com/emmawilson", followers: 45000, verified: true },
          ],
        },
      ]

      setCards(mockInfluencers)
    } catch (error) {
      console.error("Failed to fetch influencers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setDirection(direction)

    // Record the swipe action
    const currentCard = cards[currentIndex]
    if (currentCard) {
      recordSwipe(currentCard.id, direction)
    }

    setTimeout(() => {
      setDirection(null)
      setCurrentIndex(prev => prev + 1)
    }, 300)
  }

  const recordSwipe = async (influencerId: string, direction: "left" | "right" | "up") => {
    try {
      // In production, this would call an API to record the swipe
      console.log(`Recording ${direction} swipe for influencer ${influencerId}`)

      if (direction === "right") {
        // Create a match if the influencer has also swiped right
        await fetch("/api/matches/swipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            influencerId,
            direction: "right",
          }),
        })
      }
    } catch (error) {
      console.error("Failed to record swipe:", error)
    }
  }

  const currentCard = cards[currentIndex]

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-lg text-gray-600">Loading amazing influencers...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  if (session.user.role !== "SPONSOR") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Not a Sponsor</h2>
            <p className="text-gray-600 mb-4">
              This feature is only available to sponsors. Switch to a sponsor account to start matching.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-500" />
            <h2 className="text-xl font-semibold mb-2">No More Influencers</h2>
            <p className="text-gray-600 mb-4">
              You've seen all the influencers for now. Check back later for more!
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/discover")} className="w-full">
                Discover More
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Discover Influencers</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/matches")}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Matches
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Instructions */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Swipe right to connect, left to pass, up to view profile
            </p>
          </div>

          {/* Swipe Cards */}
          <div className="relative h-[600px] w-full">
            {/* Render cards behind current one */}
            {cards.slice(currentIndex + 1, currentIndex + 3).reverse().map((card, index) => (
              <div
                key={card.id}
                className="absolute inset-0"
                style={{
                  transform: `translateY(${(index + 1) * 8}px) scale(${1 - (index + 1) * 0.05})`,
                  zIndex: cards.length - currentIndex - index - 1,
                }}
              >
                <SwipeCard
                  data={card}
                  isBehind={true}
                  onSwipe={() => {}}
                />
              </div>
            ))}

            {/* Current card */}
            {currentCard && (
              <div
                className="absolute inset-0"
                style={{
                  transform: direction === "left"
                    ? "translateX(-100%) rotate(-30deg)"
                    : direction === "right"
                    ? "translateX(100%) rotate(30deg)"
                    : direction === "up"
                    ? "translateY(-100%) scale(0.8)"
                    : "translateX(0) rotate(0)",
                  transition: "transform 0.3s ease-out",
                  zIndex: cards.length - currentIndex,
                }}
              >
                <SwipeCard
                  data={currentCard}
                  isBehind={false}
                  onSwipe={handleSwipe}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center space-x-6 mt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full bg-white shadow-md hover:bg-gray-50"
              onClick={() => handleSwipe("left")}
            >
              <X className="w-6 h-6 text-red-500" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full bg-white shadow-md hover:bg-gray-50"
              onClick={() => handleSwipe("up")}
            >
              <User className="w-6 h-6 text-blue-500" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-16 h-16 rounded-full bg-white shadow-md hover:bg-gray-50"
              onClick={() => handleSwipe("right")}
            >
              <Heart className="w-6 h-6 text-green-500" />
            </Button>
          </div>

          {/* Progress */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {cards.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
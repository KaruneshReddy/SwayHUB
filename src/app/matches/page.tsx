"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, User, ArrowLeft } from "lucide-react"
import { MatchWithProfiles } from "@/types"

export default function MatchesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [matches, setMatches] = useState<MatchWithProfiles[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    fetchMatches()
  }, [session, status, router])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/matches")
      if (response.ok) {
        const data = await response.json()
        setMatches(data)
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading matches...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary-600">Your Matches</h1>
            </div>
            <Button onClick={() => router.push("/match")}>
              Discover More
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h2>
            <p className="text-gray-600 mb-6">
              Start swiping to find influencers you want to work with!
            </p>
            <Button onClick={() => router.push("/match")}>
              Start Matching
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {match.influencer.displayName}
                      </CardTitle>
                      <CardDescription>
                        {match.influencer.nicheCategories.slice(0, 2).join(", ")}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Heart className="w-3 h-3 mr-1" />
                      Match
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Followers:</span>
                      <span className="font-medium">
                        {match.influencer.totalFollowers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement:</span>
                      <span className="font-medium">{match.influencer.avgEngagementRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate per post:</span>
                      <span className="font-medium">${match.influencer.pricingPerPost}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/chat/${match.id}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/profile/${match.influencerId}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
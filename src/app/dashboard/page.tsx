"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Building, TrendingUp, MessageCircle, Users, DollarSign, Settings, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    // Fetch user profile based on role
    const fetchProfile = async () => {
      try {
        if (session.user.role === "INFLUENCER") {
          const response = await fetch("/api/influencer/profile")
          if (response.ok) {
            const profile = await response.json()
            setUserProfile(profile)
          }
        } else if (session.user.role === "SPONSOR") {
          // TODO: Create sponsor profile API
          console.log("Sponsor profile")
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    fetchProfile()
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  const isInfluencer = session.user.role === "INFLUENCER"
  const isSponsor = session.user.role === "SPONSOR"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">SwayHUB</h1>
              <Badge variant="secondary">
                {isInfluencer ? "Influencer" : "Sponsor"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push("/api/auth/signout")}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name || session.user.email}!
          </h2>
          <p className="text-gray-600">
            {isInfluencer
              ? "Manage your profile, discover campaigns, and connect with brands."
              : "Create campaigns, discover influencers, and manage partnerships."
            }
          </p>
        </div>

        {/* Profile Completion Alert */}
        {userProfile && !userProfile.profileComplete && (
          <Card className="mb-8 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Complete Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">
                Finish setting up your profile to start receiving collaboration opportunities.
              </p>
              <Button onClick={() => router.push("/onboarding/influencer")}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isInfluencer ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Total views this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Brands matched with you</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Unread conversations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0</div>
                  <p className="text-xs text-muted-foreground">Total earnings</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">In your network</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Unread conversations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0</div>
                  <p className="text-xs text-muted-foreground">On campaigns</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isInfluencer ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Discover Brands</CardTitle>
                  <CardDescription>
                    Start swiping to find brands that match your style
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => router.push("/match")}>
                    Start Matching
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>View Messages</CardTitle>
                  <CardDescription>
                    Check your conversations with brands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/messages")}>
                    Go to Messages
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Create Campaign</CardTitle>
                  <CardDescription>
                    Launch a new campaign to find influencers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => router.push("/campaigns/create")}>
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Discover Influencers</CardTitle>
                  <CardDescription>
                    Find creators that match your brand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => router.push("/discover")}>
                    Browse Influencers
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No recent activity yet. Start exploring to see updates here!
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
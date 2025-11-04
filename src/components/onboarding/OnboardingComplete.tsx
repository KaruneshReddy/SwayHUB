"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, User, Mail, MapPin, Instagram, Youtube, Twitter, DollarSign, Star } from "lucide-react"
import { InfluencerOnboardingData } from "@/types"

interface OnboardingCompleteProps {
  data: InfluencerOnboardingData
}

export function OnboardingComplete({ data }: OnboardingCompleteProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // In a real app, this would save all the onboarding data to the database
      const response = await fetch("/api/influencer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSaved(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        console.error("Failed to save profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const completionStatus = [
    { id: "basic", label: "Basic Information", completed: !!(data.displayName && data.bio), icon: User },
    { id: "social", label: "Social Media Connected", completed: !!(data.socialLinks && data.socialLinks.length > 0), icon: Instagram },
    { id: "pricing", label: "Pricing Set", completed: !!(data.pricingPerPost > 0 || data.pricingPerStory > 0), icon: DollarSign },
    { id: "niches", label: "Niches Selected", completed: !!(data.nicheCategories && data.nicheCategories.length > 0), icon: Star },
  ]

  const isComplete = completionStatus.every(item => item.completed)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Profile Setup Complete!</h3>
        <p className="text-gray-600">
          Your influencer profile is ready. Review your information and save to start connecting with brands.
        </p>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionStatus.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex items-center space-x-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className={`flex-1 ${item.completed ? "text-green-700" : "text-gray-500"}`}>
                    {item.label}
                  </span>
                  {item.completed && (
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      Complete
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Summary</CardTitle>
          <CardDescription>Review your information before saving</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Basic Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-sm"><span className="font-medium">Name:</span> {data.displayName || "Not set"}</p>
              <p className="text-sm"><span className="font-medium">Bio:</span> {data.bio || "Not set"}</p>
              {data.location && (
                <p className="text-sm flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {data.location}
                </p>
              )}
            </div>
          </div>

          {/* Social Media */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Instagram className="w-4 h-4 mr-2" />
                Social Media Accounts
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.socialLinks.map((link, index) => (
                  <Badge key={index} variant="outline">
                    {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {(data.pricingPerPost > 0 || data.pricingPerStory > 0) && (
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Pricing
              </h4>
              <div className="flex space-x-4">
                {data.pricingPerPost > 0 && (
                  <div className="bg-green-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-green-800">${data.pricingPerPost}/post</p>
                  </div>
                )}
                {data.pricingPerStory > 0 && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-blue-800">${data.pricingPerStory}/story</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Niches */}
          {data.nicheCategories && data.nicheCategories.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Niches</h4>
              <div className="flex flex-wrap gap-2">
                {data.nicheCategories.map((niche, index) => (
                  <Badge key={index} variant="secondary">
                    {niche}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>✓ Your profile will be visible to brands searching for influencers</li>
            <li>✓ Start matching with potential sponsors through the swipe interface</li>
            <li>✓ Receive and respond to collaboration proposals</li>
            <li>✓ Track campaign performance and earnings</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          disabled={isSaved}
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleSaveProfile}
          disabled={!isComplete || isSaving || isSaved}
          className="flex-1"
        >
          {isSaving ? "Saving..." : isSaved ? "Profile Saved!" : "Save Complete Profile"}
        </Button>
      </div>
    </div>
  )
}
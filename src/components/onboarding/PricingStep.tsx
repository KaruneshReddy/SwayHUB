"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Info } from "lucide-react"
import { InfluencerOnboardingData } from "@/types"

interface PricingStepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const pricingTiers = [
  {
    name: "Nano",
    followers: "1K - 10K",
    postRange: "$50 - $200",
    storyRange: "$25 - $100",
    color: "bg-blue-100 text-blue-800"
  },
  {
    name: "Micro",
    followers: "10K - 100K",
    postRange: "$200 - $1,000",
    storyRange: "$100 - $500",
    color: "bg-green-100 text-green-800"
  },
  {
    name: "Macro",
    followers: "100K - 1M",
    postRange: "$1,000 - $10,000",
    storyRange: "$500 - $5,000",
    color: "bg-purple-100 text-purple-800"
  },
  {
    name: "Mega",
    followers: "1M+",
    postRange: "$10,000+",
    storyRange: "$5,000+",
    color: "bg-orange-100 text-orange-800"
  },
]

export function PricingStep({ data, onUpdate, onNext, onBack }: PricingStepProps) {
  const handleInputChange = (field: "pricingPerPost" | "pricingPerStory", value: string) => {
    const numValue = parseFloat(value) || 0
    onUpdate({ [field]: numValue })
  }

  const handleSubmit = () => {
    onNext()
  }

  const calculateSuggestedPricing = () => {
    // This would normally calculate based on actual follower counts and engagement
    const followers = 50000 // Mock data
    const engagement = 3.5 // Mock data

    let suggestedPost = 0
    let suggestedStory = 0

    if (followers < 10000) {
      suggestedPost = 50 + (followers / 10000) * 150
      suggestedStory = suggestedPost * 0.5
    } else if (followers < 100000) {
      suggestedPost = 200 + ((followers - 10000) / 90000) * 800
      suggestedStory = suggestedPost * 0.5
    } else if (followers < 1000000) {
      suggestedPost = 1000 + ((followers - 100000) / 900000) * 9000
      suggestedStory = suggestedPost * 0.5
    } else {
      suggestedPost = 10000
      suggestedStory = 5000
    }

    // Apply engagement multiplier
    const engagementMultiplier = engagement / 3.5
    suggestedPost *= engagementMultiplier
    suggestedStory *= engagementMultiplier

    return {
      post: Math.round(suggestedPost),
      story: Math.round(suggestedStory),
    }
  }

  const suggestedPricing = calculateSuggestedPricing()

  const applySuggestedPricing = () => {
    onUpdate({
      pricingPerPost: suggestedPricing.post,
      pricingPerStory: suggestedPricing.story,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Set Your Rates</h3>
        <p className="text-gray-600">
          Define your pricing for different types of sponsored content. You can always adjust these later.
        </p>
      </div>

      {/* Industry Standards */}
      <div>
        <h4 className="font-medium mb-4">Industry Standards by Follower Count</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <CardDescription>{tier.followers} followers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className={tier.color}>{tier.postRange}</Badge>
                  <p className="text-xs text-gray-500">per post</p>
                  <Badge className={tier.color} variant="outline">{tier.storyRange}</Badge>
                  <p className="text-xs text-gray-500">per story</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested Pricing */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Suggested Pricing for Your Profile
          </CardTitle>
          <CardDescription>
            Based on typical engagement rates and follower counts in your range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Suggested per post</p>
              <p className="text-2xl font-bold text-blue-600">${suggestedPricing.post}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Suggested per story</p>
              <p className="text-2xl font-bold text-blue-600">${suggestedPricing.story}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={applySuggestedPricing}
            className="w-full"
          >
            Apply Suggested Pricing
          </Button>
        </CardContent>
      </Card>

      {/* Custom Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Your Custom Rates
          </CardTitle>
          <CardDescription>
            Set your own pricing based on your unique value and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postPrice">Price per Post (USD)</Label>
              <Input
                id="postPrice"
                type="number"
                min="0"
                step="10"
                value={data.pricingPerPost || ""}
                onChange={(e) => handleInputChange("pricingPerPost", e.target.value)}
                placeholder="e.g., 500"
              />
              <p className="text-xs text-gray-500">
                Single sponsored post or video
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storyPrice">Price per Story (USD)</Label>
              <Input
                id="storyPrice"
                type="number"
                min="0"
                step="10"
                value={data.pricingPerStory || ""}
                onChange={(e) => handleInputChange("pricingPerStory", e.target.value)}
                placeholder="e.g., 250"
              />
              <p className="text-xs text-gray-500">
                Instagram story or short-form content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-900 mb-2">Pricing Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Consider your engagement rate, not just follower count</li>
              <li>• Factor in content creation time and resources</li>
              <li>• Package deals (e.g., post + 2 stories) often perform better</li>
              <li>• Research what similar creators in your niche charge</li>
              <li>• Be prepared to negotiate for long-term partnerships</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </div>
  )
}
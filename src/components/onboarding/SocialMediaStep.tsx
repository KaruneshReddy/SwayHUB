"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Twitter, Linkedin, Tiktok, Facebook, Link2, Check, X } from "lucide-react"
import { InfluencerOnboardingData, SocialMediaLink } from "@/types"

interface SocialMediaStepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const socialPlatforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, placeholder: "@username" },
  { id: "tiktok", name: "TikTok", icon: Tiktok, placeholder: "@username" },
  { id: "youtube", name: "YouTube", icon: Youtube, placeholder: "channel URL" },
  { id: "twitter", name: "Twitter/X", icon: Twitter, placeholder: "@username" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, placeholder: "profile URL" },
  { id: "facebook", name: "Facebook", icon: Facebook, placeholder: "page URL" },
]

export function SocialMediaStep({ data, onUpdate, onNext, onBack }: SocialMediaStepProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    data.socialLinks?.map(link => link.platform) || []
  )
  const [platformInputs, setPlatformInputs] = useState<Record<string, string>>(
    data.socialLinks?.reduce((acc, link) => {
      acc[link.platform] = link.url
      return acc
    }, {} as Record<string, string>) || {}
  )

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      const newPlatforms = prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]

      // Clear input if deselected
      if (!newPlatforms.includes(platformId)) {
        setPlatformInputs(prev => {
          const newInputs = { ...prev }
          delete newInputs[platformId]
          return newInputs
        })
      }

      return newPlatforms
    })
  }

  const handleInputChange = (platformId: string, value: string) => {
    setPlatformInputs(prev => ({
      ...prev,
      [platformId]: value
    }))
  }

  const handleConnect = async (platformId: string) => {
    // This would connect to the actual OAuth flow for each platform
    // For now, we'll simulate a successful connection
    const url = platformInputs[platformId]

    if (!url) return

    // Simulate verification process
    const socialLinks = selectedPlatforms.map(platform => ({
      platform: platform as SocialMediaLink["platform"],
      url: platformInputs[platform] || "",
      followers: Math.floor(Math.random() * 100000) + 1000, // Mock data
      verified: true,
    }))

    onUpdate({ socialLinks })
  }

  const handleRemovePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => prev.filter(p => p !== platformId))
    setPlatformInputs(prev => {
      const newInputs = { ...prev }
      delete newInputs[platformId]
      return newInputs
    })
  }

  const handleSubmit = () => {
    const socialLinks = selectedPlatforms.map(platform => ({
      platform: platform as SocialMediaLink["platform"],
      url: platformInputs[platform] || "",
      followers: Math.floor(Math.random() * 100000) + 1000, // Mock data
      verified: true,
    }))

    onUpdate({ socialLinks })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Connect Your Social Media</h3>
        <p className="text-gray-600">
          Link your social media accounts to verify your influence and showcase your reach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon
          const isSelected = selectedPlatforms.includes(platform.id)
          const isConnected = data.socialLinks?.some(link => link.platform === platform.id)
          const inputUrl = platformInputs[platform.id]

          return (
            <Card key={platform.id} className={`${isSelected ? "ring-2 ring-primary-500" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <CardTitle className="text-sm">{platform.name}</CardTitle>
                    {isConnected && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlatform(platform.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={isSelected ? "text-primary-600" : "text-gray-400"}
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {isSelected && !isConnected && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Input
                      placeholder={platform.placeholder}
                      value={inputUrl || ""}
                      onChange={(e) => handleInputChange(platform.id, e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleConnect(platform.id)}
                      disabled={!inputUrl}
                    >
                      Connect {platform.name}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Why connect your accounts?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Verify your follower counts and engagement</li>
          <li>• Build trust with potential sponsors</li>
          <li>• Get discovered by brands looking for your niche</li>
          <li>• Access better sponsorship opportunities</li>
        </ul>
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
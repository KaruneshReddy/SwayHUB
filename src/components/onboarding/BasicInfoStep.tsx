"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, User } from "lucide-react"
import { InfluencerOnboardingData } from "@/types"

interface BasicInfoStepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function BasicInfoStep({ data, onUpdate, onNext, onBack }: BasicInfoStepProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // For now, we'll use a placeholder URL
    // In production, this would upload to Cloudinary
    setTimeout(() => {
      onUpdate({ profileImageUrl: "/placeholder-avatar.jpg" })
      setIsUploading(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!data.displayName || !data.bio) {
      return
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {data.profileImageUrl ? (
              <img
                src={data.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Upload a professional profile photo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name *</Label>
          <Input
            id="displayName"
            value={data.displayName}
            onChange={(e) => onUpdate({ displayName: e.target.value })}
            placeholder="How should brands address you?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location || ""}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio *</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          placeholder="Tell brands about yourself, your content style, and what makes you unique..."
          rows={4}
          maxLength={500}
          required
        />
        <p className="text-sm text-gray-500">
          {data.bio.length}/500 characters
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={!data.displayName || !data.bio}>
          Next
        </Button>
      </div>
    </form>
  )
}
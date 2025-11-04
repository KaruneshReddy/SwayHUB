"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfluencerOnboardingData } from "@/types"

interface NicheStepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const nicheCategories = [
  // Fashion & Beauty
  { id: "fashion", name: "Fashion", emoji: "👗", description: "Style, trends, apparel" },
  { id: "beauty", name: "Beauty", emoji: "💄", description: "Makeup, skincare, cosmetics" },
  { id: "lifestyle", name: "Lifestyle", emoji: "🌟", description: "Daily life, general content" },

  // Health & Fitness
  { id: "fitness", name: "Fitness", emoji: "💪", description: "Workouts, health, wellness" },
  { id: "health", name: "Health", emoji: "🏥", description: "Medical advice, wellness" },
  { id: "nutrition", name: "Nutrition", emoji: "🥗", description: "Diet, recipes, food" },

  // Technology
  { id: "tech", name: "Technology", emoji: "💻", description: "Gadgets, software, innovation" },
  { id: "gaming", name: "Gaming", emoji: "🎮", description: "Video games, streaming" },
  { id: "apps", name: "Apps & Software", emoji: "📱", description: "Mobile apps, tools" },

  // Travel & Culture
  { id: "travel", name: "Travel", emoji: "✈️", description: "Destinations, experiences" },
  { id: "food", name: "Food & Dining", emoji: "🍽️", description: "Restaurants, cuisine" },
  { id: "culture", name: "Culture", emoji: "🎭", description: "Arts, entertainment" },

  // Business & Finance
  { id: "business", name: "Business", emoji: "💼", description: "Entrepreneurship, career" },
  { id: "finance", name: "Finance", emoji: "💰", description: "Investing, money advice" },
  { id: "marketing", name: "Marketing", emoji: "📊", description: "Digital marketing, branding" },

  // Creative & Entertainment
  { id: "art", name: "Art & Design", emoji: "🎨", description: "Visual arts, creativity" },
  { id: "music", name: "Music", emoji: "🎵", description: "Songs, performances" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", description: "Movies, shows, media" },

  // Family & Home
  { id: "family", name: "Family", emoji: "👨‍👩‍👧‍👦", description: "Parenting, family life" },
  { id: "home", name: "Home & Garden", emoji: "🏠", description: "Decor, DIY, gardening" },
  { id: "pets", name: "Pets", emoji: "🐾", description: "Animals, pet care" },

  // Sports & Outdoors
  { id: "sports", name: "Sports", emoji: "⚽", description: "Athletics, competitions" },
  { id: "outdoors", name: "Outdoors", emoji: "🏕️", description: "Nature, adventure" },

  // Education & Personal Development
  { id: "education", name: "Education", emoji: "📚", description: "Learning, skills" },
  { id: "selfhelp", name: "Self Help", emoji: "🧠", description: "Personal growth" },
  { id: "books", name: "Books", emoji: "📖", description: "Reading, literature" },

  // Other
  { id: "comedy", name: "Comedy", emoji: "😄", description: "Humor, entertainment" },
  { id: "photography", name: "Photography", emoji: "📸", description: "Photo content" },
  { id: "diy", name: "DIY & Crafts", emoji: "🔧", description: "Projects, tutorials" },
  { id: "sustainability", name: "Sustainability", emoji: "🌱", description: "Eco-friendly content" },
]

export function NicheStep({ data, onUpdate, onNext, onBack }: NicheStepProps) {
  const [selectedNiches, setSelectedNiches] = useState<string[]>(data.nicheCategories || [])

  const handleNicheToggle = (nicheId: string) => {
    setSelectedNiches(prev => {
      const newNiches = prev.includes(nicheId)
        ? prev.filter(n => n !== nicheId)
        : [...prev, nicheId]

      onUpdate({ nicheCategories: newNiches })
      return newNiches
    })
  }

  const handleSubmit = () => {
    if (selectedNiches.length === 0) {
      return
    }
    onNext()
  }

  const categoriesByGroup = [
    {
      title: "Fashion & Beauty",
      items: nicheCategories.filter(n => ["fashion", "beauty", "lifestyle"].includes(n.id))
    },
    {
      title: "Health & Fitness",
      items: nicheCategories.filter(n => ["fitness", "health", "nutrition"].includes(n.id))
    },
    {
      title: "Technology & Gaming",
      items: nicheCategories.filter(n => ["tech", "gaming", "apps"].includes(n.id))
    },
    {
      title: "Travel & Culture",
      items: nicheCategories.filter(n => ["travel", "food", "culture"].includes(n.id))
    },
    {
      title: "Business & Finance",
      items: nicheCategories.filter(n => ["business", "finance", "marketing"].includes(n.id))
    },
    {
      title: "Creative & Entertainment",
      items: nicheCategories.filter(n => ["art", "music", "entertainment"].includes(n.id))
    },
    {
      title: "Family & Home",
      items: nicheCategories.filter(n => ["family", "home", "pets"].includes(n.id))
    },
    {
      title: "Sports & Outdoors",
      items: nicheCategories.filter(n => ["sports", "outdoors"].includes(n.id))
    },
    {
      title: "Education & Learning",
      items: nicheCategories.filter(n => ["education", "selfhelp", "books"].includes(n.id))
    },
    {
      title: "Other Categories",
      items: nicheCategories.filter(n => ["comedy", "photography", "diy", "sustainability"].includes(n.id))
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Choose Your Niches</h3>
        <p className="text-gray-600">
          Select 1-5 categories that best describe your content. This helps brands find you for relevant partnerships.
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Selected: {selectedNiches.length}/5 categories
          </p>
        </div>
      </div>

      {/* Selected Niches */}
      {selectedNiches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Selected Niches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedNiches.map(nicheId => {
                const niche = nicheCategories.find(n => n.id === nicheId)
                return (
                  <Badge key={nicheId} variant="default" className="text-sm">
                    {niche?.emoji} {niche?.name}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Niche Categories */}
      <div className="space-y-6">
        {categoriesByGroup.map((group) => (
          <div key={group.title}>
            <h4 className="font-medium text-gray-900 mb-3">{group.title}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((niche) => {
                const isSelected = selectedNiches.includes(niche.id)
                return (
                  <Card
                    key={niche.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? "ring-2 ring-primary-500 bg-primary-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleNicheToggle(niche.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{niche.emoji}</div>
                        <div className="flex-1">
                          <h5 className="font-medium">{niche.name}</h5>
                          <p className="text-xs text-gray-500">{niche.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm">Choosing Your Niches</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific and authentic to your actual content</li>
            <li>• Choose categories where you have genuine expertise</li>
            <li>• Consider which brands you'd want to work with</li>
            <li>• Don't select too many - focus on your strongest areas</li>
            <li>• You can update these later as your content evolves</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={selectedNiches.length === 0}
        >
          Complete Profile
        </Button>
      </div>
    </div>
  )
}
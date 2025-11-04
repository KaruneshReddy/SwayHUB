"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon, ExternalLink } from "lucide-react"
import { InfluencerOnboardingData } from "@/types"

interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
}

interface PortfolioStepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function PortfolioStep({ data, onUpdate, onNext, onBack }: PortfolioStepProps) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // For now, we'll use a placeholder URL
    // In production, this would upload to Cloudinary
    setTimeout(() => {
      setNewItem(prev => ({ ...prev, imageUrl: "/placeholder-portfolio.jpg" }))
      setIsUploading(false)
    }, 1000)
  }

  const addPortfolioItem = () => {
    if (!newItem.title) return

    const item: PortfolioItem = {
      id: Date.now().toString(),
      ...newItem,
    }

    setPortfolioItems(prev => [...prev, item])
    setNewItem({
      title: "",
      description: "",
      imageUrl: "",
      linkUrl: "",
    })
  }

  const removePortfolioItem = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = () => {
    // Store portfolio items in the user data
    // In a real app, this would be saved to the database
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Portfolio</h3>
        <p className="text-gray-600">
          Showcase your best work to demonstrate your content quality and style.
        </p>
      </div>

      {/* Add New Portfolio Item */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Add Portfolio Item</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Summer Fashion Campaign"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link (optional)</Label>
                <Input
                  id="linkUrl"
                  value={newItem.linkUrl}
                  onChange={(e) => setNewItem(prev => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the campaign, your role, and results..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {newItem.imageUrl ? (
                    <img
                      src={newItem.imageUrl}
                      alt="Portfolio preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="portfolio-image"
                    className="flex items-center space-x-2 cursor-pointer text-primary-600 hover:text-primary-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      id="portfolio-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={addPortfolioItem}
              disabled={!newItem.title}
              className="w-full"
            >
              Add to Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Items */}
      {portfolioItems.length > 0 && (
        <div>
          <h4 className="font-medium mb-4">Your Portfolio ({portfolioItems.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium">{item.title}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePortfolioItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    {item.imageUrl && (
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {item.linkUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">Portfolio Tips</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Show your best performing content</li>
          <li>• Include a variety of content types and brands</li>
          <li>• Highlight campaigns with measurable results</li>
          <li>• Keep descriptions concise and focused on your role</li>
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
}

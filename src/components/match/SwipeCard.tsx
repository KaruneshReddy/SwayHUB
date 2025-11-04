"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Twitter, ExternalLink, MapPin, Users, DollarSign, Heart, X, User } from "lucide-react"
import { SwipeCardData } from "@/types"

interface SwipeCardProps {
  data: SwipeCardData
  isBehind: boolean
  onSwipe: (direction: "left" | "right" | "up") => void
}

export function SwipeCard({ data, isBehind, onSwipe }: SwipeCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isBehind) return
    setDragStart({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart || isBehind) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!dragStart || isBehind) return

    const threshold = 100
    const absX = Math.abs(dragOffset.x)
    const absY = Math.abs(dragOffset.y)

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        onSwipe(dragOffset.x > 0 ? "right" : "left")
      } else {
        // Vertical swipe
        onSwipe(dragOffset.y < 0 ? "up" : "left")
      }
    }

    setDragStart(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isBehind) return
    const touch = e.touches[0]
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart || isBehind) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    if (!dragStart || isBehind) return
    handleMouseUp()
  }

  // Global mouse events for dragging outside the card
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragStart) return
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        setDragOffset({ x: deltaX, y: deltaY })
      }

      const handleGlobalMouseUp = () => {
        handleMouseUp()
      }

      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const calculateRotation = () => {
    if (!dragStart) return 0
    return dragOffset.x * 0.1
  }

  const getSwipeIndicator = () => {
    if (!dragStart) return null

    const threshold = 100
    const absX = Math.abs(dragOffset.x)
    const absY = Math.abs(dragOffset.y)

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        return dragOffset.x > 0 ? "right" : "left"
      } else {
        return dragOffset.y < 0 ? "up" : null
      }
    }

    return null
  }

  const swipeIndicator = getSwipeIndicator()

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 ${isBehind ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isBehind ? "" : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${calculateRotation()}deg)`,
        transition: isDragging ? "none" : "transform 0.2s ease-out",
      }}
    >
      <Card className="h-full w-full shadow-lg overflow-hidden">
        {/* Swipe Indicator Overlay */}
        {!isBehind && swipeIndicator && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {swipeIndicator === "right" && (
              <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center space-x-2">
                  <Heart className="w-6 h-6" />
                  <span className="text-lg font-semibold">LIKE</span>
                </div>
              </div>
            )}
            {swipeIndicator === "left" && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center space-x-2">
                  <X className="w-6 h-6" />
                  <span className="text-lg font-semibold">PASS</span>
                </div>
              </div>
            )}
            {swipeIndicator === "up" && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span className="text-lg font-semibold">PROFILE</span>
                </div>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-0 h-full">
          {/* Profile Image */}
          <div className="relative h-3/5 bg-gray-200">
            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-500">
                  {data.displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{data.displayName}</h2>
              <div className="flex items-center space-x-4 text-sm">
                {data.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{data.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(data.totalFollowers)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-green-300">•</span>
                  <span>{data.avgEngagementRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Bio */}
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {data.bio}
            </p>

            {/* Niches */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data.nicheCategories.slice(0, 3).map((niche) => (
                <Badge key={niche} variant="secondary" className="text-xs">
                  {niche}
                </Badge>
              ))}
              {data.nicheCategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{data.nicheCategories.length - 3}
                </Badge>
              )}
            </div>

            {/* Social Media */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {data.verifiedPlatforms.map((platform) => {
                  let icon
                  switch (platform) {
                    case "instagram":
                      icon = <Instagram className="w-4 h-4" />
                      break
                    case "youtube":
                      icon = <Youtube className="w-4 h-4" />
                      break
                    case "twitter":
                      icon = <Twitter className="w-4 h-4" />
                      break
                    default:
                      icon = <ExternalLink className="w-4 h-4" />
                  }
                  return (
                    <div
                      key={platform}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      {icon}
                    </div>
                  )
                })}
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>${data.pricingPerPost}/post</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
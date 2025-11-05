import { User, InfluencerProfile, SponsorProfile, Campaign, Match, Message } from '@prisma/client'

export type {
  User,
  InfluencerProfile,
  SponsorProfile,
  Campaign,
  Match,
  Message,
  UserRole,
  UserStatus,
  CampaignType,
  CampaignStatus,
  MatchStatus,
  SwipeDirection,
  ApplicationStatus,
  EscrowStatus,
} from '@prisma/client'

export interface UserWithProfile extends User {
  influencerProfile?: InfluencerProfile | null
  sponsorProfile?: SponsorProfile | null
}

export interface InfluencerWithUser extends InfluencerProfile {
  user: User
}

export interface SponsorWithUser extends SponsorProfile {
  user: User
}

export interface CampaignWithSponsor extends Campaign {
  sponsor: SponsorWithUser
  _count?: {
    applications: number
    matches: number
  }
}

export interface MatchWithProfiles extends Match {
  influencer: InfluencerWithUser
  sponsor: SponsorWithUser
  campaign?: Campaign | null
  _count?: {
    messages: number
  }
}

export interface MessageWithSender extends Message {
  sender: User
}

export interface SocialMediaLink {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook'
  url: string
  followers?: number
  verified?: boolean
}

export interface SocialMediaVerification {
  platform: string
  userId: string
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
  profileData?: any
}

export interface SwipeCardData {
  id: string
  displayName: string
  bio?: string
  profileImageUrl?: string
  nicheCategories: string[]
  totalFollowers: number
  avgEngagementRate: number
  pricingPerPost: number
  verifiedPlatforms: string[]
  socialLinks?: SocialMediaLink[]
}

export interface SearchFilters {
  query?: string
  niches?: string[]
  followerRange?: {
    min: number
    max: number
  }
  engagementRange?: {
    min: number
    max: number
  }
  location?: string
  verifiedOnly?: boolean
  pricingRange?: {
    min: number
    max: number
  }
}

export interface CampaignFormData {
  title: string
  description: string
  budget: number
  campaignType: CampaignType
  requirements?: any
  targetAudience?: any
  deadline?: Date
}

export interface InfluencerOnboardingData {
  displayName: string
  bio: string
  location?: string
  profileImageUrl?: string
  nicheCategories?: string[]
  socialLinks?: SocialMediaLink[]
  pricingPerPost?: number
  pricingPerStory?: number
}

export interface SponsorOnboardingData {
  companyName: string
  industry: string
  companyDescription: string
  logoUrl?: string
  websiteUrl?: string
  budgetRange: {
    min: number
    max: number
  }
  targetAudience?: any
  campaignPreferences?: any
}

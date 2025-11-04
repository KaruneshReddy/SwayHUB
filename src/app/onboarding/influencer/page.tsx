"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BasicInfoStep } from "@/components/onboarding/BasicInfoStep"
import { SocialMediaStep } from "@/components/onboarding/SocialMediaStep"
import { PortfolioStep } from "@/components/onboarding/PortfolioStep"
import { PricingStep } from "@/components/onboarding/PricingStep"
import { NicheStep } from "@/components/onboarding/NicheStep"
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete"
import { InfluencerOnboardingData } from "@/types"

interface StepProps {
  data: InfluencerOnboardingData
  onUpdate: (data: Partial<InfluencerOnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Social Media", description: "Connect your accounts" },
  { id: 3, title: "Portfolio", description: "Showcase your work" },
  { id: 4, title: "Pricing", description: "Set your rates" },
  { id: 5, title: "Niches", description: "Choose your categories" },
  { id: 6, title: "Complete", description: "Review your profile" },
]

export default function InfluencerOnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<InfluencerOnboardingData>({
    displayName: "",
    bio: "",
    location: "",
    profileImageUrl: "",
    nicheCategories: [],
    socialLinks: [],
    pricingPerPost: 0,
    pricingPerStory: 0,
  })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/login")
    return null
  }

  if (session.user.role !== "INFLUENCER") {
    router.push("/dashboard")
    return null
  }

  const updateData = (newData: Partial<InfluencerOnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    const stepProps: StepProps = {
      data: onboardingData,
      onUpdate: updateData,
      onNext: handleNext,
      onBack: handleBack,
    }

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />
      case 2:
        return <SocialMediaStep {...stepProps} />
      case 3:
        return <PortfolioStep {...stepProps} />
      case 4:
        return <PricingStep {...stepProps} />
      case 5:
        return <NicheStep {...stepProps} />
      case 6:
        return <OnboardingComplete data={onboardingData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Influencer Onboarding
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your profile to attract the best sponsorship opportunities
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-primary-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                    step.id <= currentStep
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs text-center max-w-20 hidden sm:block">
                  <div className="font-medium">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
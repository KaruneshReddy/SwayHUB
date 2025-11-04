"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Chrome, Github, Mail, User, Building } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRole.INFLUENCER,
  })
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Auto-login after successful registration
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.ok) {
          router.push(`/onboarding/${formData.role.toLowerCase()}`)
        } else {
          router.push("/login")
        }
      } else {
        const data = await response.json()
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setIsLoading(true)
    try {
      await signIn(provider, {
        callbackUrl: `/onboarding/${selectedRole?.toLowerCase() || 'influencer'}`
      })
    } catch (error) {
      setError("Failed to sign in with " + provider)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join SwayHUB and start connecting with brands or influencers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            {!selectedRole && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">I want to:</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleRoleSelect(UserRole.INFLUENCER)}
                  >
                    <User className="w-6 h-6" />
                    <span className="text-sm">Be an Influencer</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col space-y-2"
                    onClick={() => handleRoleSelect(UserRole.SPONSOR)}
                  >
                    <Building className="w-6 h-6" />
                    <span className="text-sm">Be a Sponsor</span>
                  </Button>
                </div>
              </div>
            )}

            {selectedRole && (
              <>
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="mb-4"
                  >
                    ← Change role
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    You selected: {selectedRole === UserRole.INFLUENCER ? "Influencer" : "Sponsor"}
                  </p>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading}
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Continue with GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="text-sm text-destructive text-center">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </>
            )}

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/login")}>
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
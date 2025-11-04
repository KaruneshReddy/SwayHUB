import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            influencerProfile: true,
            sponsorProfile: true,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          status: user.status,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.status = user.status
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.status = token.status as string
      }

      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true
      }

      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // For OAuth users, we'll set default role and let them complete onboarding
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: UserRole.INFLUENCER, // Default role
              status: "PENDING",
              emailVerified: new Date(),
            },
          })
        }
      }

      return true
    },
  },
}
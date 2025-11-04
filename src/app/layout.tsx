import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwayHUB - Influencer Marketing Marketplace",
  description: "Connect with influencers and grow your brand through our swipe-based matching platform",
  keywords: ["influencer marketing", "sponsorship", "social media", "brand partnerships"],
  authors: [{ name: "SwayHUB Team" }],
  openGraph: {
    title: "SwayHUB - Influencer Marketing Marketplace",
    description: "Connect with influencers and grow your brand through our swipe-based matching platform",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
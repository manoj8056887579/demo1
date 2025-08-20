import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { QuotationProvider } from "@/components/quotation-provider"
import { SEOProvider } from "@/components/providers/seo-provider"
import { ThemeProvider } from "@/components/providers/theme"
import { DynamicFavicon } from "@/components/dynamic-favicon"
import { GoogleAuthProvider } from '@/components/providers/google-auth-provider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Filigree Solutions - Advanced CAD & CAE Services",
  description: "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India.",
  keywords: "CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider>
          <DynamicFavicon />
          <SEOProvider>
            <GoogleAuthProvider>
              <QuotationProvider>{children}</QuotationProvider>
            </GoogleAuthProvider>
          </SEOProvider>
        </ThemeProvider>
        <Toaster  />
      </body>
    </html>
  )
}

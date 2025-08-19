"use client"

import { useSEOMeta } from "@/hooks/use-seo-meta"

export function PortfolioSeo() {
  // Use SEO data for services page
  useSEOMeta({
    pageId: 'portfolio',
    fallback: {
        title: 'Engineering Portfolio - Case Studies & Projects | Filigree Solutions',
        description: 'Explore our portfolio of successful engineering projects including telecom towers, EV components, industrial systems, and structural analysis case studies.',
        keywords: 'engineering portfolio, case studies, telecom projects, EV analysis, structural projects, engineering solutions'
      }
  })

  // This component doesn't render anything visible, it just handles SEO
  return null
}
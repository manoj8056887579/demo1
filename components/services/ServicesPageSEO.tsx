"use client"

import { useSEOMeta } from "@/hooks/use-seo-meta"

export function ServicesPageSEO() {
  // Use SEO data for services page
  useSEOMeta({
    pageId: 'services',
    fallback: {
      title: 'Engineering Services - CAD, CAE, Structural Analysis | Filigree Solutions',
      description: 'Comprehensive engineering services including CAD drafting, 3D modeling, structural analysis, EV component simulation, and telecom tower analysis.',
      keywords: 'engineering services, CAD drafting, 3D modeling, structural analysis, EV simulation, telecom analysis, GD&T application'
    }
  })

  // This component doesn't render anything visible, it just handles SEO
  return null
}
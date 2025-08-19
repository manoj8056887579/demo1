"use client"

import { useSEOMeta } from "@/hooks/use-seo-meta"

export function HomeSeo() {
  // Use SEO data for services page
  useSEOMeta({
    pageId: 'home',
    fallback: {
      title: 'Filigree Solutions - Advanced CAD & CAE Services | Engineering Excellence',
      description: 'Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India. Expert solutions for automotive, telecom, and industrial sectors.',
      keywords: 'CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation, FEA, automotive engineering, telecom analysis'
    }
  })

  // This component doesn't render anything visible, it just handles SEO
  return null
}
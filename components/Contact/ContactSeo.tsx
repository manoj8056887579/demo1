"use client"

import { useSEOMeta } from "@/hooks/use-seo-meta"

export function ContactPageSeo() {
  // Use SEO data for services page
  useSEOMeta({
    pageId: 'contact',
    fallback: {
        title: 'Contact Filigree Solutions - Get Engineering Consultation',
        description: 'Contact our engineering experts for CAD, CAE, and structural analysis services. Located in Madurai, Tamil Nadu. Get quotes and consultations.',
        keywords: 'contact filigree solutions, engineering consultation, CAD services quote, Madurai engineering, structural analysis contact'
      }
  })

  // This component doesn't render anything visible, it just handles SEO
  return null
}
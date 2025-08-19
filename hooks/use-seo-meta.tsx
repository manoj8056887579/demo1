"use client"

import { useEffect } from 'react'
import { useSEO } from '@/components/providers/seo-provider'

interface SEOMetaOptions {
  pageId: string
  fallback?: {
    title?: string
    description?: string
    keywords?: string
  }
}

export function useSEOMeta({ pageId, fallback }: SEOMetaOptions) {
  const { getSEOByPageId, loading } = useSEO()
  
  useEffect(() => {
    if (loading) return

    const seoData = getSEOByPageId(pageId)
    
    // Update document title
    const title = seoData?.title || fallback?.title || 'Filigree Solutions'
    document.title = title
    
    // Update meta description
    const description = seoData?.description || fallback?.description || 'Leading provider of CAD, CAE, and engineering services'
    updateMetaTag('description', description)
    
    // Update meta keywords
    const keywords = seoData?.keywords || fallback?.keywords || 'CAD services, CAE analysis, engineering'
    updateMetaTag('keywords', keywords)
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:type', 'website', 'property')
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:card', 'summary_large_image')
    
  }, [pageId, loading, getSEOByPageId, fallback])

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`)
    
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute(attribute, name)
      document.head.appendChild(metaTag)
    }
    
    metaTag.setAttribute('content', content)
  }

  return {
    seoData: getSEOByPageId(pageId),
    loading
  }
}
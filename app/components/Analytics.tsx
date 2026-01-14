'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date | object,
      config?: object
    ) => void
    dataLayer?: any[]
    __analyticsInitialized?: boolean
  }
}

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view on route change (client-side navigation)
    // Skip initial mount to avoid duplicate with initial pageview
    const isInitialMount = !window.__analyticsInitialized
    window.__analyticsInitialized = true
    
    if (isInitialMount) {
      return // Skip first render, let initial pageview handle it
    }

    // Track route changes immediately (even on fast navigation)
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent')
      
      // Only track if consent is granted
      if (consent === 'accepted') {
        // Get current URL
        const url = window.location.href
        const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : ''
        const pagePath = pathname + queryString
        
        // Use requestIdleCallback for non-blocking tracking, but with timeout for fast navigation
        const trackPageView = () => {
          if (window.gtag) {
            // Ensure consent is granted before sending
            window.gtag('consent', 'update', {
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            })
            
            // Send pageview with consent parameters immediately
            window.gtag('config', 'G-ZGXL6MTDYY', {
              page_path: pagePath,
              page_location: url,
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            })
          } else {
            // If gtag not loaded yet, queue the pageview
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
              event: 'page_view',
              page_path: pagePath,
              page_location: url,
            })
          }
        }
        
        // Track immediately (don't wait for idle) to catch fast navigation
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(trackPageView, { timeout: 100 })
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(trackPageView, 0)
        }
      }
    }
  }, [pathname, searchParams])

  return null
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  )
}

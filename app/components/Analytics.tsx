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
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Skip initial mount to avoid duplicate with initial pageview (since send_page_view is true)
      const isInitialMount = !window.__analyticsInitialized
      window.__analyticsInitialized = true
      
      if (isInitialMount) {
        // Debug logging for localhost
        const isLocalhost = window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        if (isLocalhost) {
          console.log('🔍 Analytics: Skipping initial mount (auto pageview will fire)')
        }
        return // Skip first render, let initial pageview handle it
      }

      // Get current URL immediately (no async delays for fast navigation)
      const url = window.location?.href || ''
      const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : ''
      const pagePath = (pathname || '') + queryString
      
      // Track immediately without any delays to catch fast navigation
      const trackPageView = () => {
        try {
          if (window.gtag) {
            // Send pageview immediately - analytics_storage is always granted
            window.gtag('event', 'page_view', {
              page_path: pagePath,
              page_location: url,
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            })
          } else {
            // If gtag not loaded yet, queue the pageview in dataLayer
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
              event: 'page_view',
              page_path: pagePath,
              page_location: url,
            })
          }
        } catch (error) {
          console.error('Error tracking pageview:', error)
        }
      }
      
      // Track immediately - no delays for fast navigation
      // Use microtask queue for non-blocking execution, but immediate
      Promise.resolve().then(() => trackPageView())
    } catch (error) {
      console.error('Error in Analytics useEffect:', error)
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

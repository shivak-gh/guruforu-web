'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './ConsentBanner.module.css'

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date | object,
      config?: object
    ) => void
    dataLayer?: any[]
  }
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      // Check if consent has been given
      const consent = localStorage.getItem('cookie-consent')
      if (!consent) {
        // Show banner after a short delay
        setTimeout(() => {
          setShowBanner(true)
          setIsLoading(false)
        }, 1000)
      } else {
        setIsLoading(false)
        // If consent was already given, ensure analytics is enabled with consent signals
        if (consent === 'accepted') {
          // Wait a bit for gtag to be available
          setTimeout(() => {
            try {
              if (window.gtag) {
                // Update consent to ensure signals are sent
                window.gtag('consent', 'update', {
                  analytics_storage: 'granted',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                })
                // Reconfigure to ensure consent parameters are included
                window.gtag('config', 'G-ZGXL6MTDYY', {
                  analytics_storage: 'granted',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                })
              }
            } catch (error) {
              console.error('Error updating consent:', error)
            }
          }, 500)
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error)
      setIsLoading(false)
    }
  }, [])

  const handleAccept = () => {
    try {
      if (typeof window === 'undefined') return
      
      localStorage.setItem('cookie-consent', 'accepted')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      setShowBanner(false)
      
      // Enable Google Analytics with proper consent signals
      try {
        // Update consent immediately if gtag is available
        if (window.gtag) {
          // Update consent state (required for Consent Mode v2)
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          })
          
          // Reconfigure GA with granted consent to ensure signals are sent
          window.gtag('config', 'G-ZGXL6MTDYY', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          })
        } else {
          // If gtag not loaded yet, push to dataLayer
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            'event': 'consent_update',
            'analytics_storage': 'granted',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
          })
        }
      } catch (error) {
        console.error('Error updating analytics consent:', error)
      }
      
      // Small delay before reload to ensure consent is saved and signals sent
      setTimeout(() => {
        try {
          window.location.reload()
        } catch (error) {
          console.error('Error reloading page:', error)
        }
      }, 200)
    } catch (error) {
      console.error('Error accepting cookies:', error)
      setShowBanner(false)
    }
  }

  const handleReject = () => {
    try {
      if (typeof window === 'undefined') return
      
      localStorage.setItem('cookie-consent', 'rejected')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      setShowBanner(false)
      
      // Disable Google Analytics
      try {
        if (window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
          })
        }
      } catch (error) {
        console.error('Error updating analytics consent:', error)
      }
    } catch (error) {
      console.error('Error rejecting cookies:', error)
      setShowBanner(false)
    }
  }

  if (isLoading || !showBanner) {
    return null
  }

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie Consent">
      <div className={styles.bannerContent}>
        <div className={styles.bannerText}>
          <h3 className={styles.bannerTitle}>Cookie Consent</h3>
          <p className={styles.bannerDescription}>
            We use cookies to enhance your browsing experience and analyze site traffic. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies. 
            <Link href="/privacy" className={styles.privacyLink}> Learn more</Link>
          </p>
        </div>
        <div className={styles.bannerActions}>
          <button 
            onClick={handleReject}
            className={styles.rejectButton}
            aria-label="Reject cookies"
          >
            Reject All
          </button>
          <button 
            onClick={handleAccept}
            className={styles.acceptButton}
            aria-label="Accept cookies"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

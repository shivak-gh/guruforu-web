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
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Enable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }
    
    // Reload to apply consent
    window.location.reload()
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Disable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
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

'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Script from 'next/script'
import { detectLocale, localizeText, type Region } from '../../lib/locale'
import PageFooter from '../components/PageFooter'

// Lazy load NavMenu to reduce initial bundle size
const NavMenu = dynamic(() => import('../components/NavMenu'), {
  ssr: true,
})

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
    gtag?: (
      command: string,
      targetId: string | Date | object,
      config?: object
    ) => void
    dataLayer?: any[]
  }
}

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [region, setRegion] = useState<Region>('DEFAULT')
  const recaptchaLoaded = useRef(false)
  // Get reCAPTCHA site key from environment (embedded at build time in Next.js)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  
  useEffect(() => {
    const localeInfo = detectLocale()
    setRegion(localeInfo.region)
  }, [])
  
  const localized = (text: string) => localizeText(text, region)

  // Debug: Log site key on mount (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (recaptchaSiteKey) {
        console.log('reCAPTCHA Site Key configured:', `${recaptchaSiteKey.substring(0, 10)}...`)
      } else {
        console.warn('reCAPTCHA Site Key not set. Form will work without reCAPTCHA on localhost.')
      }
    }
  }, [recaptchaSiteKey])

  // Load reCAPTCHA script
  useEffect(() => {
    if (!recaptchaSiteKey) {
      console.warn('reCAPTCHA Site Key is not set. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable.')
      return
    }

    if (recaptchaLoaded.current || window.grecaptcha) {
      return
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`)
    if (existingScript) {
      // Script already exists, wait for it to load
      const checkGrecaptcha = setInterval(() => {
        if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
          recaptchaLoaded.current = true
          clearInterval(checkGrecaptcha)
        }
      }, 100)

      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(checkGrecaptcha), 10000)
      return
    }

    // Create and load the script
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      // Wait for grecaptcha to be fully initialized
      if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
        recaptchaLoaded.current = true
        console.log('reCAPTCHA v3 loaded successfully')
      } else {
        // If grecaptcha isn't immediately available, check periodically
        const checkReady = setInterval(() => {
          if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
            recaptchaLoaded.current = true
            console.log('reCAPTCHA v3 ready')
            clearInterval(checkReady)
          }
        }, 100)
        setTimeout(() => clearInterval(checkReady), 10000)
      }
    }

    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
      recaptchaLoaded.current = false
    }

    document.head.appendChild(script)

    return () => {
      // Don't remove script on unmount as it might be used elsewhere
      // The browser will handle cleanup
    }
  }, [recaptchaSiteKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!recaptchaSiteKey) {
      console.error('reCAPTCHA Site Key is not configured')
      return null
    }

    // Wait for grecaptcha to be available (with timeout)
    let attempts = 0
    const maxAttempts = 50 // 5 seconds total (50 * 100ms)

    while (!window.grecaptcha && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }

    if (!window.grecaptcha || typeof window.grecaptcha.ready !== 'function') {
      console.error('reCAPTCHA is not loaded. Please check your Site Key and network connection.')
      return null
    }

    try {
      return await new Promise((resolve) => {
        // Use grecaptcha.ready to ensure it's fully initialized
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(recaptchaSiteKey, {
              action: 'contact_form'
            })
            if (!token) {
              console.error('reCAPTCHA returned empty token')
              resolve(null)
            } else {
              console.log('reCAPTCHA token generated successfully')
              resolve(token)
            }
          } catch (error: any) {
            console.error('reCAPTCHA execution error:', error)
            console.error('Error details:', {
              message: error?.message,
              siteKey: recaptchaSiteKey.substring(0, 10) + '...'
            })
            resolve(null)
          }
        })
      })
    } catch (error: any) {
      console.error('reCAPTCHA error:', error)
      console.error('Error message:', error?.message)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Skip reCAPTCHA for localhost in development mode
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'
      const skipRecaptcha = isLocalhost && process.env.NODE_ENV === 'development'

      let recaptchaToken = null
      if (!skipRecaptcha && recaptchaSiteKey) {
        // Get reCAPTCHA token right before submission to avoid expiration
        // Generate token as late as possible to minimize expiration risk
        console.log('Getting fresh reCAPTCHA token...')
        try {
          recaptchaToken = await getRecaptchaToken()
          if (!recaptchaToken) {
            console.error('Failed to get reCAPTCHA token after retries')
            setSubmitStatus('error')
            setIsSubmitting(false)
            // Error message will be shown from the error status
            return
          }
          console.log('reCAPTCHA token received, submitting immediately...')
          // Submit immediately after getting token to avoid expiration
        } catch (error: any) {
          console.error('Error getting reCAPTCHA token:', error)
          setSubmitStatus('error')
          setIsSubmitting(false)
          // Error message will be shown from the error status
          return
        }
      } else if (skipRecaptcha) {
        console.warn('⚠️ Skipping reCAPTCHA for localhost (development mode)')
      } else if (!recaptchaSiteKey) {
        console.warn('⚠️ reCAPTCHA Site Key not configured, submitting without token')
      }

      // Submit form with reCAPTCHA token (or without if skipped)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(recaptchaToken && { recaptchaToken }),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        // Fire Google Analytics events for contact form
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'contact_form_submit', {
            event_category: 'Contact',
            event_label: 'Contact Form Submission',
          })
          window.gtag('event', 'conversion_event_submit_lead_form', {
            event_category: 'Contact',
            event_label: 'Contact Form Submission',
          })
        }
      } else {
        console.error('Form submission error:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details
        })
        
        // Store error message for display
        if (data.error) {
          setErrorMessage(data.error)
        } else {
          setErrorMessage('Something went wrong. Please try again.')
        }
        
        // Check if it's a reCAPTCHA error specifically
        if (data.error?.includes('reCAPTCHA') || response.status === 400) {
          console.error('reCAPTCHA verification failed:', data.error)
          if (data.details) {
            console.error('reCAPTCHA error details:', data.details)
            
            // Log specific error codes if available
            if (data.details.errorCodes) {
              console.error('reCAPTCHA error codes:', data.details.errorCodes)
              
              // Provide helpful messages for common error codes
              const errorCodeMessages: Record<string, string> = {
                'missing-input-secret': 'reCAPTCHA secret key is missing',
                'invalid-input-secret': 'reCAPTCHA secret key is invalid',
                'missing-input-response': 'reCAPTCHA token is missing',
                'invalid-input-response': 'reCAPTCHA token is invalid or expired',
                'bad-request': 'Invalid request to reCAPTCHA API',
                'timeout-or-duplicate': 'reCAPTCHA token has expired or was already used',
              }
              
              data.details.errorCodes.forEach((code: string) => {
                if (errorCodeMessages[code]) {
                  console.error(`  - ${code}: ${errorCodeMessages[code]}`)
                }
              })
            }
            
            if (data.details.score !== undefined) {
              console.warn(`reCAPTCHA score: ${data.details.score} (may be too low for localhost testing)`)
            }
          }
        }
        
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setErrorMessage('Network error. Please check your connection and try again.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ContactPage structured data for SEO
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact GuruForU',
    'description': 'Contact GuruForU for questions about online classes, AI-powered learning, or student progress tracking.',
    'url': 'https://www.guruforu.com/contact',
    'mainEntity': {
      '@type': 'Organization',
      'name': 'GuruForU',
      'url': 'https://www.guruforu.com',
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Customer Service',
        'email': 'support@guruforu.com',
        'availableLanguage': 'English'
      }
    }
  }

  return (
    <>
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {/* noscript fallback for Google Ads form detection */}
      <noscript>
        <form action="/api/contact" method="post" id="contact-form-noscript">
          <input type="text" name="name" placeholder="Name" required autoComplete="name" />
          <input type="email" name="email" placeholder="Email" required autoComplete="email" />
          <select name="subject" required>
            <option value="">Select subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
          </select>
          <textarea name="message" placeholder="Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </noscript>
      <NavMenu />
      <main className="form-page">
        <section className="form-page-main" aria-labelledby="contact-heading">
          <div className="gf-container">
            <header className="form-page-head">
              <h1 id="contact-heading" className="form-page-head-title">
                {localized('Contact')} <span className="gf-text-primary">{localized('Us')}</span>
              </h1>
              <p className="form-page-head-lead">
                {localized('Questions about classes, billing, or support? Fill out the form — we typically reply within 24–48 hours on business days.')}
              </p>
            </header>

            <div className="gf-form-grid gf-form-grid-contact">
              <div className="gf-form-card">
                <form
                  id="contact-form"
                  className="gf-form"
                  onSubmit={handleSubmit}
                  action="/api/contact"
                  method="post"
                  data-form-type="contact"
                >
                <div className="gf-form-body">
                <div className="gf-form-row gf-form-row-2">
                <div className="gf-form-group">
                  <label htmlFor="name" className="gf-form-label">
                    {localized('Name')} <span className="gf-form-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="gf-form-input"
                    placeholder={localized('Your full name')}
                  />
                </div>

                <div className="gf-form-group">
                  <label htmlFor="email" className="gf-form-label">
                    {localized('Email')} <span className="gf-form-required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="gf-form-input"
                    placeholder={localized('your.email@example.com')}
                  />
                </div>
                </div>

                <div className="gf-form-group">
                  <label htmlFor="subject" className="gf-form-label">
                    {localized('Subject')} <span className="gf-form-required">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="gf-form-select"
                  >
                    <option value="">{localized('Select a subject')}</option>
                    <option value="general">{localized('General Inquiry')}</option>
                    <option value="support">{localized('Technical Support')}</option>
                    <option value="billing">{localized('Billing Question')}</option>
                    <option value="feedback">{localized('Feedback')}</option>
                    <option value="other">{localized('Other')}</option>
                  </select>
                </div>

                <div className="gf-form-group">
                  <label htmlFor="message" className="gf-form-label">
                    {localized('Message')} <span className="gf-form-required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="gf-form-textarea"
                    placeholder={localized('Tell us how we can help you...')}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="gf-form-msg gf-form-msg-success">
                    {localized('Thank you! Your message has been sent successfully. We\'ll get back to you soon.')}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="gf-form-msg gf-form-msg-error" role="alert">
                    <strong>{localized('Oops! Something went wrong.')}</strong>
                    <br />
                    {errorMessage || localized('Please check your browser console (F12) for detailed error information.')}
                    <br />
                    <small>{localized('If the issue persists, please email us directly at')} <a href="mailto:support@guruforu.com" className="gf-form-link">support@guruforu.com</a></small>
                  </div>
                )}

                <div className="gf-form-actions">
                  <button
                    type="submit"
                    name="submit"
                    disabled={isSubmitting}
                    className="gf-btn-primary"
                  >
                    {isSubmitting ? localized('Sending...') : localized('Send Message')}
                  </button>
                </div>

                {!recaptchaSiteKey && typeof window !== 'undefined' &&
                 (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                  <div className="gf-form-msg gf-form-msg-warning">
                    ⚠️ Note: reCAPTCHA is not configured for localhost. Form will work without reCAPTCHA verification.
                    To enable reCAPTCHA, set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local and restart your dev server.
                  </div>
                )}

                {recaptchaSiteKey && !recaptchaLoaded.current && (
                  <div className="gf-form-msg gf-form-msg-info">
                    ℹ️ Loading reCAPTCHA protection...
                  </div>
                )}

                </div>
              </form>
            </div>

            <aside className="gf-form-aside" aria-label={localized('Contact information')}>
              <div className="gf-info-card">
                <h2 className="gf-info-card-title">{localized('Email')}</h2>
                <p className="gf-info-card-text">
                  <a href="mailto:support@guruforu.com" className="gf-form-link">
                    support@guruforu.com
                  </a>
                </p>
              </div>
              <div className="gf-info-card">
                <h2 className="gf-info-card-title">{localized('Response Time')}</h2>
                <p className="gf-info-card-text">
                  {localized('We typically respond within')} <strong>24-48 hours</strong> {localized('during business days')}
                </p>
              </div>
              <div className="gf-info-card">
                <h2 className="gf-info-card-title">{localized('Support Availability')}</h2>
                <p className="gf-info-card-text">
                  {localized('We\'re here to help! Reach out anytime and we\'ll get back to you')} <strong>{localized('as soon as possible')}</strong>.
                </p>
              </div>
            </aside>
            </div>
          </div>
        </section>

        <section className="about-section about-section-alt">
          <div className="gf-container">
            <div className="gf-form-links">
              <p className="gf-form-links-text">{localized('You may also find answers in our:')}</p>
              <div className="gf-form-links-row">
                <Link href="/terms" className="gf-form-link" prefetch={false}>{localized('Terms and Conditions')}</Link>
                <Link href="/privacy" className="gf-form-link" prefetch={false}>{localized('Privacy Policy')}</Link>
                <Link href="/cancellation-refunds" className="gf-form-link" prefetch={false}>{localized('Cancellation and Refunds')}</Link>
              </div>
            </div>
          </div>
        </section>

        <PageFooter localized={localized} />
      </main>
    </>
  )
}

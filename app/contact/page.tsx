'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
import Link from 'next/link'
import Script from 'next/script'
import { detectLocale, localizeText, type Region } from '../../lib/locale'

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
      <div className={styles.container}>
        <div className={styles.background}>
          <div className={styles.gradient}></div>
        </div>

        <div className={styles.content}>
        <div className={styles.pageContent}>
          <h1 className={styles.title}>{localized('Contact Us')}</h1>
          <p className={styles.subtitle}>
            {localized('We\'d love to hear from you! Get in touch with us for any')} <strong>{localized('questions, feedback, or support')}</strong> {localized('about our')} <strong>{localized('online education platform')}</strong>.
          </p>
          <p className={styles.subtitle}>
            Whether you have questions about our online classes, need help with your account, or want to learn more about AI-powered learning and progress tracking, our team is here to help. Fill out the form below and we&apos;ll get back to you within 24–48 hours on business days.
          </p>

          <h2 className={styles.sectionTitle}>{localized('Get in Touch')}</h2>

          <div className={styles.contactSection}>
            <div className={styles.contactInfo}>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>{localized('Email')}</h3>
                <p className={styles.infoText}>
                  <a href="mailto:support@guruforu.com" className={styles.emailLink}>
                    support@guruforu.com
                  </a>
                </p>
              </div>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>{localized('Response Time')}</h3>
                <p className={styles.infoText}>{localized('We typically respond within')} <strong>24-48 hours</strong> {localized('during business days')}</p>
              </div>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>{localized('Support Availability')}</h3>
                <p className={styles.infoText}>{localized('We\'re here to help! Reach out anytime and we\'ll get back to you')} <strong>{localized('as soon as possible')}</strong>.</p>
              </div>
            </div>

            <form 
              id="contact-form"
              className={styles.contactForm} 
              onSubmit={handleSubmit}
              action="/api/contact"
              method="post"
              data-form-type="contact"
            >
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  {localized('Name')} <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className={styles.input}
                  placeholder={localized('Your full name')}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  {localized('Email')} <span className={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={styles.input}
                  placeholder={localized('your.email@example.com')}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  {localized('Subject')} <span className={styles.required}>*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">{localized('Select a subject')}</option>
                  <option value="general">{localized('General Inquiry')}</option>
                  <option value="support">{localized('Technical Support')}</option>
                  <option value="billing">{localized('Billing Question')}</option>
                  <option value="feedback">{localized('Feedback')}</option>
                  <option value="other">{localized('Other')}</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  {localized('Message')} <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={styles.textarea}
                  placeholder={localized('Tell us how we can help you...')}
                />
              </div>

              {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                  {localized('Thank you! Your message has been sent successfully. We\'ll get back to you soon.')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={styles.errorMessage} role="alert">
                  <strong>{localized('Oops! Something went wrong.')}</strong>
                  <br />
                  {errorMessage || localized('Please check your browser console (F12) for detailed error information.')}
                  <br />
                  <small>{localized('If the issue persists, please email us directly at')} <a href="mailto:support@guruforu.com" className={styles.emailLink}>support@guruforu.com</a></small>
                </div>
              )}

              {!recaptchaSiteKey && typeof window !== 'undefined' && 
               (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                <div className={styles.warningMessage}>
                  ⚠️ Note: reCAPTCHA is not configured for localhost. Form will work without reCAPTCHA verification. 
                  To enable reCAPTCHA, set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local and restart your dev server.
                </div>
              )}

              {recaptchaSiteKey && !recaptchaLoaded.current && (
                <div className={styles.infoMessage}>
                  ℹ️ Loading reCAPTCHA protection...
                </div>
              )}

              <button
                type="submit"
                name="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? localized('Sending...') : localized('Send Message')}
              </button>
            </form>
          </div>

          <div className={styles.additionalLinks}>
            <p className={styles.linksText}>{localized('You may also find answers in our:')}</p>
            <div className={styles.links}>
              <Link href="/terms" className={styles.link} prefetch={false}>{localized('Terms and Conditions')}</Link>
              <Link href="/privacy" className={styles.link} prefetch={false}>{localized('Privacy Policy')}</Link>
              <Link href="/cancellation-refunds" className={styles.link} prefetch={false}>{localized('Cancellation and Refunds')}</Link>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} GuruForU. {localized('All rights reserved.')}</p>
        </footer>
      </div>
    </div>
    </>
  )
}
